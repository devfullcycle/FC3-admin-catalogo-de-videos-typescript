import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import {
  Category,
  CategoryId,
} from '../../../../../category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { GenreInMemoryRepository } from '../../../../infra/db/in-memory/genre-in-memory.repository';
import { CreateGenreUseCase } from '../create-genre.use-case';

describe('CreateGenreUseCase Unit Tests', () => {
  let useCase: CreateGenreUseCase;
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
    useCase = new CreateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  describe('execute method', () => {
    it('should throw an entity validation error when categories id not exists', async () => {
      expect.assertions(3);
      const spyValidateCategoriesId = jest.spyOn(
        categoriesIdsExistsInStorageValidator,
        'validate',
      );
      try {
        await useCase.execute({
          name: 'test',
          categories_id: [
            '4f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
            '7f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a',
          ],
        });
        //valid uuid - 7f7e1c30-3f7a-4f51-9f4a-3e9c4c8f1a1a
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

    it('should create a genre', async () => {
      const category1 = Category.fake().aCategory().build();
      const category2 = Category.fake().aCategory().build();
      await categoryRepo.bulkInsert([category1, category2]);
      const spyInsert = jest.spyOn(genreRepo, 'insert');
      const spyUowDo = jest.spyOn(uow, 'do');
      let output = await useCase.execute({
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
      });
      expect(spyUowDo).toHaveBeenCalledTimes(1);
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: genreRepo.items[0].genre_id.id,
        name: 'test',
        categories: [category1, category2].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
        categories_id: [category1.category_id.id, category2.category_id.id],
        is_active: true,
        created_at: genreRepo.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        is_active: false,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(spyUowDo).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: genreRepo.items[1].genre_id.id,
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        categories: [category1, category2].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
        is_active: false,
        created_at: genreRepo.items[1].created_at,
      });
    });
  });
});
