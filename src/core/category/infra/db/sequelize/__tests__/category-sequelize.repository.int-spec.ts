import { CategoryModel } from '../category.model';
import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategoryModelMapper } from '../category-model-mapper';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../domain/category.repository';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategorySequelizeRepository Integration Test', () => {
  let repository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it('should inserts a new entity', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const categoryCreated = await repository.findById(category.category_id);
    expect(categoryCreated!.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new CategoryId());
    expect(entityFound).toBeNull();

    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should return all categories', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = Category.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category),
    );
  });

  it('should update a entity', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName('Movie updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const categoryId = new CategoryId();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category),
    );
  });

  it('should delete a entity', async () => {
    const entity = new Category({ name: 'Movie' });
    await repository.insert(entity);

    await repository.delete(entity.category_id);
    await expect(repository.findById(entity.category_id)).resolves.toBeNull();
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.category_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at: created_at,
        }),
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);

      const categories = [
        Category.fake().aCategory().withName('b').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('d').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('c').build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        Category.fake().aCategory().withName('test').build(),
        Category.fake().aCategory().withName('a').build(),
        Category.fake().aCategory().withName('TEST').build(),
        Category.fake().aCategory().withName('e').build(),
        Category.fake().aCategory().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
