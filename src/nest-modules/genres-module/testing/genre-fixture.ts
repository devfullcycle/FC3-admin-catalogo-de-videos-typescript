import { Category } from '../../../core/category/domain/category.aggregate';
import { Genre } from '../../../core/genre/domain/genre.aggregate';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

const _keysInResponse = [
  'id',
  'name',
  'categories_id',
  'categories',
  'is_active',
  'created_at',
];

export class GetGenreFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateGenreFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForSave() {
    const faker = Genre.fake().aGenre().withName('test name');

    const category = Category.fake().aCategory().build();

    const case1 = {
      relations: {
        categories: [category],
      },
      send_data: {
        name: faker.name,
        categories_id: [category.category_id.id],
      },
      expected: {
        name: faker.name,
        categories: expect.arrayContaining([
          {
            id: category.category_id.id,
            name: category.name,
            created_at: category.created_at.toISOString(),
          },
        ]),
        categories_id: expect.arrayContaining([category.category_id.id]),
        is_active: true,
      },
    };

    const categories = Category.fake().theCategories(3).build();
    const case2 = {
      relations: {
        categories,
      },
      send_data: {
        name: faker.name,
        categories_id: [
          categories[0].category_id.id,
          categories[1].category_id.id,
          categories[2].category_id.id,
        ],
        categories: expect.arrayContaining([
          {
            id: categories[0].category_id.id,
            name: categories[0].name,
            created_at: categories[0].created_at.toISOString(),
          },
          {
            id: categories[1].category_id.id,
            name: categories[1].name,
            created_at: categories[1].created_at.toISOString(),
          },
          {
            id: categories[2].category_id.id,
            name: categories[2].name,
            created_at: categories[2].created_at.toISOString(),
          },
        ]),
        is_active: false,
      },
      expected: {
        name: faker.name,
        categories_id: expect.arrayContaining([
          categories[0].category_id.id,
          categories[1].category_id.id,
          categories[2].category_id.id,
        ]),
        categories: expect.arrayContaining([
          {
            id: categories[0].category_id.id,
            name: categories[0].name,
            created_at: categories[0].created_at.toISOString(),
          },
          {
            id: categories[1].category_id.id,
            name: categories[1].name,
            created_at: categories[1].created_at.toISOString(),
          },
          {
            id: categories[2].category_id.id,
            name: categories[2].name,
            created_at: categories[2].created_at.toISOString(),
          },
        ]),
        is_active: false,
      },
    };

    return [case1, case2];
  }

  static arrangeInvalidRequest() {
    const faker = Genre.fake().aGenre();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'categories_id should not be empty',
            'categories_id must be an array',
            'each value in categories_id must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
          categories_id: [faker.categories_id[0].id],
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
          categories_id: [faker.categories_id[0].id],
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
          categories_id: [faker.categories_id[0].id],
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      CATEGORIES_ID_UNDEFINED: {
        send_data: {
          name: faker.name,
          categories_id: undefined,
        },
        expected: {
          message: [
            'categories_id should not be empty',
            'categories_id must be an array',
            'each value in categories_id must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      CATEGORIES_ID_NULL: {
        send_data: {
          name: faker.name,
          categories_id: null,
        },
        expected: {
          message: [
            'categories_id should not be empty',
            'categories_id must be an array',
            'each value in categories_id must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      CATEGORIES_ID_EMPTY: {
        send_data: {
          name: faker.name,
          categories_id: '',
        },
        expected: {
          message: [
            'categories_id should not be empty',
            'categories_id must be an array',
            'each value in categories_id must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      CATEGORIES_ID_NOT_VALID: {
        send_data: {
          name: faker.name,
          categories_id: ['a'],
        },
        expected: {
          message: ['each value in categories_id must be a UUID'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Genre.fake().aGenre();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          categories_id: ['d8952775-5f69-42d5-9e94-00f097e1b98c'],
        },
        expected: {
          message: [
            'name must be shorter than or equal to 255 characters',
            'Category Not Found using ID d8952775-5f69-42d5-9e94-00f097e1b98c',
          ],
          ...defaultExpected,
        },
      },
      CATEGORIES_ID_NOT_EXISTS: {
        send_data: {
          name: faker.withName('action').name,
          categories_id: ['d8952775-5f69-42d5-9e94-00f097e1b98c'],
        },
        expected: {
          message: [
            'Category Not Found using ID d8952775-5f69-42d5-9e94-00f097e1b98c',
          ],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateGenreFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForSave() {
    const faker = Genre.fake().aGenre().withName('test name');

    const category = Category.fake().aCategory().build();

    const case1 = {
      entity: faker.addCategoryId(category.category_id).build(),
      relations: {
        categories: [category],
      },
      send_data: {
        name: faker.name,
        categories_id: [category.category_id.id],
      },
      expected: {
        name: faker.name,
        categories_id: expect.arrayContaining([category.category_id.id]),
        categories: expect.arrayContaining([
          {
            id: category.category_id.id,
            name: category.name,
            created_at: category.created_at.toISOString(),
          },
        ]),
        is_active: true,
      },
    };

    const case2 = {
      entity: faker.addCategoryId(category.category_id).build(),
      relations: {
        categories: [category],
      },
      send_data: {
        name: faker.name,
        categories_id: [category.category_id.id],
        is_active: false,
      },
      expected: {
        name: faker.name,
        categories_id: expect.arrayContaining([category.category_id.id]),
        categories: expect.arrayContaining([
          {
            id: category.category_id.id,
            name: category.name,
            created_at: category.created_at.toISOString(),
          },
        ]),
        is_active: false,
      },
    };

    const categories = Category.fake().theCategories(3).build();
    const case3 = {
      entity: faker.addCategoryId(category.category_id).build(),
      relations: {
        categories: [category, ...categories],
      },
      send_data: {
        name: faker.name,
        categories_id: [
          categories[0].category_id.id,
          categories[1].category_id.id,
          categories[2].category_id.id,
        ],
      },
      expected: {
        name: faker.name,
        categories_id: expect.arrayContaining([
          categories[0].category_id.id,
          categories[1].category_id.id,
          categories[2].category_id.id,
        ]),
        categories: expect.arrayContaining([
          {
            id: categories[0].category_id.id,
            name: categories[0].name,
            created_at: categories[0].created_at.toISOString(),
          },
          {
            id: categories[1].category_id.id,
            name: categories[1].name,
            created_at: categories[1].created_at.toISOString(),
          },
          {
            id: categories[2].category_id.id,
            name: categories[2].name,
            created_at: categories[2].created_at.toISOString(),
          },
        ]),
        is_active: true,
      },
    };

    return [case1, case2, case3];
  }

  static arrangeInvalidRequest() {
    const faker = Genre.fake().aGenre();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      CATEGORIES_ID_NOT_VALID: {
        send_data: {
          name: faker.name,
          categories_id: ['a'],
        },
        expected: {
          message: ['each value in categories_id must be a UUID'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Genre.fake().aGenre();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      CATEGORIES_ID_NOT_EXISTS: {
        send_data: {
          name: faker.withName('action').name,
          categories_id: ['d8952775-5f69-42d5-9e94-00f097e1b98c'],
        },
        expected: {
          message: [
            'Category Not Found using ID d8952775-5f69-42d5-9e94-00f097e1b98c',
          ],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListGenresFixture {
  static arrangeIncrementedWithCreatedAt() {
    const category = Category.fake().aCategory().build();
    const _entities = Genre.fake()
      .theGenres(4)
      .addCategoryId(category.category_id)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const relations = {
      categories: new Map([[category.category_id.id, category]]),
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap, relations };
  }

  static arrangeUnsorted() {
    const categories = Category.fake().theCategories(4).build();

    const relations = {
      categories: new Map(
        categories.map((category) => [category.category_id.id, category]),
      ),
    };

    const created_at = new Date();

    const entitiesMap = {
      test: Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .withName('test')
        .withCreatedAt(new Date(created_at.getTime() + 1000))
        .build(),
      a: Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .withName('a')
        .withCreatedAt(new Date(created_at.getTime() + 2000))
        .build(),
      TEST: Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 3000))
        .build(),
      e: Genre.fake()
        .aGenre()
        .addCategoryId(categories[3].category_id)
        .withName('e')
        .withCreatedAt(new Date(created_at.getTime() + 4000))
        .build(),
      TeSt: Genre.fake()
        .aGenre()
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TeSt')
        .withCreatedAt(new Date(created_at.getTime() + 5000))
        .build(),
    };

    const arrange_filter_by_name_sort_name_asc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { name: 'TEST' },
        },
        get label() {
          return JSON.stringify(this.send_data);
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.TeSt],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { name: 'TEST' },
        },
        get label() {
          return JSON.stringify(this.send_data);
        },
        expected: {
          entities: [entitiesMap.test],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_by_categories_id_and_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { categories_id: [categories[0].category_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.a],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { categories_id: [categories[0].category_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.test],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.TeSt, entitiesMap.TEST],
          meta: {
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.a, entitiesMap.test],
          meta: {
            total: 4,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return {
      arrange: [
        ...arrange_filter_by_name_sort_name_asc,
        ...arrange_filter_by_categories_id_and_sort_by_created_desc,
      ],
      entitiesMap,
      relations,
    };
  }
}
