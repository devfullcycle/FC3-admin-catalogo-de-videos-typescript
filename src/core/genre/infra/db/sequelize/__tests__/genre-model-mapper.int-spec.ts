import { Category } from '../../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../../category/domain/category.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { LoadEntityError } from '../../../../../shared/domain/validators/validation.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import { GenreCategoryModel, GenreModel } from '../genre-model';
import { GenreModelMapper } from '../genre-model-mapper';

describe('GenreModelMapper Unit Tests', () => {
  let categoryRepo: ICategoryRepository;
  setupSequelize({ models: [CategoryModel, GenreModel, GenreCategoryModel] });

  beforeEach(() => {
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
  });

  it('should throws error when genre is invalid', () => {
    const arrange = [
      {
        makeModel: () => {
          //@ts-expect-error - an invalid genre
          return GenreModel.build({
            genre_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            name: 't'.repeat(256),
            categories_id: [],
          });
        },
        expectedErrors: [
          {
            categories_id: ['categories_id should not be empty'],
          },
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ],
      },
    ];

    for (const item of arrange) {
      try {
        GenreModelMapper.toEntity(item.makeModel());
        fail('The genre is valid, but it needs throws a LoadEntityError');
      } catch (e) {
        expect(e).toBeInstanceOf(LoadEntityError);
        expect(e.error).toMatchObject(item.expectedErrors);
      }
    }
  });

  it('should convert a genre model to a genre entity', async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    await categoryRepo.bulkInsert([category1, category2]);
    const created_at = new Date();
    const model = await GenreModel.create(
      {
        genre_id: '5490020a-e866-4229-9adc-aa44b83234c4',
        name: 'some value',
        categories_id: [
          GenreCategoryModel.build({
            genre_id: '5490020a-e866-4229-9adc-aa44b83234c4',
            category_id: category1.category_id.id,
          }),
          GenreCategoryModel.build({
            genre_id: '5490020a-e866-4229-9adc-aa44b83234c4',
            category_id: category2.category_id.id,
          }),
        ],
        is_active: true,
        created_at,
      },
      { include: ['categories_id'] },
    );
    const entity = GenreModelMapper.toEntity(model);
    expect(entity.toJSON()).toEqual(
      new Genre({
        genre_id: new GenreId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        categories_id: new Map([
          [category1.category_id.id, category1.category_id],
          [category2.category_id.id, category2.category_id],
        ]),
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });
});
