import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import {
  Category,
  CategoryId,
} from '../../../../../category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { Genre } from '../../../../domain/genre.aggregate';
import { GenreInMemoryRepository } from '../../../../infra/db/in-memory/genre-in-memory.repository';
import { UpdateGenreInput } from '../update-genre.input';
import { UpdateGenreUseCase } from '../update-genre.use-case';

describe('UpdateGenreUseCase Unit Tests', () => {
  let useCase: UpdateGenreUseCase;
  let genreRepo: GenreInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let categoriesIdsExistsInStorageValidator: CategoriesIdExistsInDatabaseValidator;
  let uow: UnitOfWorkFakeInMemory;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    genreRepo = new GenreInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    categoriesIdsExistsInStorageValidator =
      new CategoriesIdExistsInDatabaseValidator(categoryRepo);
    useCase = new UpdateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  describe('execute method', () => {
    it('should throw an entity validation error when categories id not exists', async () => {
      expect.assertions(3);
      const genre = Genre.fake().aGenre().build();
      await genreRepo.insert(genre);
      const spyValidateCategoriesId = jest.spyOn(
        categoriesIdsExistsInStorageValidator,
        'validate',
      );
      try {
        await useCase.execute(
          new UpdateGenreInput({
            id: genre.genre_id.id,
            name: 'test',
            categories_id: [
              '4f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
              '7f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
            ],
          }),
        );
      } catch (e) {
        expect(spyValidateCategoriesId).toHaveBeenCalledWith([
          '4f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
          '7f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
        ]);
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.error).toStrictEqual([
          {
            categories_id: [
              'Category Not Found using ID 4f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
              'Category Not Found using ID 7f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
            ],
          },
        ]);
      }
    });

    it('should update a genre', async () => {
      const category1 = Category.fake().aCategory().build();
      const category2 = Category.fake().aCategory().build();
      await categoryRepo.bulkInsert([category1, category2]);
      const genre1 = Genre.fake()
        .aGenre()
        .addCategoryId(category1.category_id)
        .addCategoryId(category2.category_id)
        .build();
      await genreRepo.insert(genre1);
      const spyUpdate = jest.spyOn(genreRepo, 'update');
      const spyUowDo = jest.spyOn(uow, 'do');
      let output = await useCase.execute(
        new UpdateGenreInput({
          id: genre1.genre_id.id,
          name: 'test',
          categories_id: [category1.category_id.id],
        }),
      );
      expect(spyUowDo).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: genreRepo.items[0].genre_id.id,
        name: 'test',
        categories: [category1].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
        categories_id: [category1.category_id.id],
        is_active: true,
        created_at: genreRepo.items[0].created_at,
      });

      output = await useCase.execute({
        id: genre1.genre_id.id,
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        is_active: false,
      });
      expect(spyUpdate).toHaveBeenCalledTimes(2);
      expect(spyUowDo).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: genreRepo.items[0].genre_id.id,
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        categories: [category1, category2].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
        is_active: false,
        created_at: genreRepo.items[0].created_at,
      });
    });
  });
});
