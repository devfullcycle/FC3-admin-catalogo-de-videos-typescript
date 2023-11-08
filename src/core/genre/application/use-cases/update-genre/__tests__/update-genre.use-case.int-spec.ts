import {
  UpdateGenreOutput,
  UpdateGenreUseCase,
} from '../update-genre.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';

import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Category } from '../../../../../category/domain/category.aggregate';
import { UpdateGenreInput } from '../update-genre.input';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';

describe('UpdateGenreUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: UpdateGenreUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsExistsInStorageValidator: CategoriesIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    categoriesIdsExistsInStorageValidator =
      new CategoriesIdExistsInDatabaseValidator(categoryRepo);
    useCase = new UpdateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  it('should update a genre', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const entity = Genre.fake()
      .aGenre()
      .addCategoryId(categories[1].category_id)
      .build();
    await genreRepo.insert(entity);

    let output = await useCase.execute(
      new UpdateGenreInput({
        id: entity.genre_id.id,
        name: 'test',
        categories_id: [categories[0].category_id.id],
      }),
    );
    expect(output).toStrictEqual({
      id: entity.genre_id.id,
      name: 'test',
      categories: expect.arrayContaining(
        [categories[0]].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
      ),
      categories_id: expect.arrayContaining([categories[0].category_id.id]),
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: UpdateGenreInput;
      expected: UpdateGenreOutput;
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.genre_id.id,
          categories_id: [
            categories[1].category_id.id,
            categories[2].category_id.id,
          ],
          is_active: true,
        },
        expected: {
          id: entity.genre_id.id,
          name: 'test',
          categories: expect.arrayContaining(
            [categories[1], categories[2]].map((e) => ({
              id: e.category_id.id,
              name: e.name,
              created_at: e.created_at,
            })),
          ),
          categories_id: expect.arrayContaining([
            categories[1].category_id.id,
            categories[2].category_id.id,
          ]),
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.genre_id.id,
          name: 'test changed',
          categories_id: [
            categories[1].category_id.id,
            categories[2].category_id.id,
          ],
          is_active: false,
        },
        expected: {
          id: entity.genre_id.id,
          name: 'test changed',
          categories: expect.arrayContaining(
            [categories[1], categories[2]].map((e) => ({
              id: e.category_id.id,
              name: e.name,
              created_at: e.created_at,
            })),
          ),
          categories_id: expect.arrayContaining([
            categories[1].category_id.id,
            categories[2].category_id.id,
          ]),
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute(i.input);
      const entityUpdated = await genreRepo.findById(new GenreId(i.input.id));
      expect(output).toStrictEqual({
        id: entity.genre_id.id,
        name: i.expected.name,
        categories: i.expected.categories,
        categories_id: i.expected.categories_id,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        genre_id: entity.genre_id.id,
        name: i.expected.name,
        categories_id: i.expected.categories_id,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });

  it('rollback transaction', async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const entity = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(entity);

    GenreModel.afterBulkUpdate('hook-test', () => {
      return Promise.reject(new Error('Generic Error'));
    });

    await expect(
      useCase.execute(
        new UpdateGenreInput({
          id: entity.genre_id.id,
          name: 'test',
          categories_id: [category.category_id.id],
        }),
      ),
    ).rejects.toThrow(new Error('Generic Error'));

    GenreModel.removeHook('afterBulkUpdate', 'hook-test');

    const notUpdatedGenre = await genreRepo.findById(entity.genre_id);
    expect(notUpdatedGenre!.name).toStrictEqual(entity.name);
  });
});
