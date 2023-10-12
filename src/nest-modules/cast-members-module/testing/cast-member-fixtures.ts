import { CastMemberTypes } from '../../../core/cast-member/domain/cast-member-type.vo';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

const _keysInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = CastMember.fake().anActor().withName('Member');
    return [
      {
        send_data: {
          name: faker.name,
          type: CastMemberTypes.ACTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberTypes.ACTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: CastMemberTypes.DIRECTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberTypes.DIRECTOR,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = CastMember.fake().anActor().withName('Member');
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
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
          type: faker.type.type,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
          type: faker.type.type,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
          type: faker.type.type,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      TYPE_UNDEFINED: {
        send_data: {
          name: faker.withName('Member').name,
          type: undefined,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_NULL: {
        send_data: {
          name: faker.withName('Member').name,
          type: null,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_EMPTY: {
        send_data: {
          name: faker.withName('Member').name,
          type: '',
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
          ],
          ...defaultExpected,
        },
      },
      TYPE_NOT_A_NUMBER: {
        send_data: {
          name: faker.withName('Member').name,
          type: 'A',
        },
        expected: {
          message: ['type must be an integer number'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().anActor().withName('Member');
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          type: faker.type.type,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: faker.withName('Member').name,
          type: 10,
        },
        expected: {
          message: ['Invalid cast member type: 10'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const faker = CastMember.fake().anActor().withName('Member');
    return [
      {
        send_data: {
          name: faker.name,
          type: faker.type.type,
        },
        expected: {
          name: faker.name,
          type: faker.type.type,
        },
      },
      {
        send_data: {
          name: faker.name + ' Updated',
        },
        expected: {
          name: faker.name + ' Updated',
        },
      },
      {
        send_data: {
          type: CastMemberTypes.DIRECTOR,
        },
        expected: {
          type: CastMemberTypes.DIRECTOR,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = CastMember.fake().anActor().withName('Member');
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_INVALID: {
        send_data: {
          name: faker.name,
          type: 'a',
        },
        expected: {
          message: ['type must be an integer number'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().anActor().withName('Member');
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_INVALID: {
        send_data: {
          name: faker.name,
          type: 10,
        },
        expected: {
          message: ['Invalid cast member type: 10'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = CastMember.fake()
      .theCastMembers(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
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

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const actor = CastMember.fake().anActor();
    const director = CastMember.fake().aDirector();
    const created_at = new Date();
    const entitiesMap = {
      actor_a: actor
        .withName('a')
        .withCreatedAt(new Date(created_at.getTime() + 1000))
        .build(),
      actor_AAA: actor
        .withName('AAA')
        .withCreatedAt(new Date(created_at.getTime() + 2000))
        .build(),
      actor_AaA: actor
        .withName('AaA')
        .withCreatedAt(new Date(created_at.getTime() + 3000))
        .build(),
      actor_b: actor
        .withName('b')
        .withCreatedAt(new Date(created_at.getTime() + 4000))
        .build(),
      actor_c: actor
        .withName('c')
        .withCreatedAt(new Date(created_at.getTime() + 5000))
        .build(),
      director_f: director
        .withName('f')
        .withCreatedAt(new Date(created_at.getTime() + 6000))
        .build(),
      director_e: director
        .withName('e')
        .withCreatedAt(new Date(created_at.getTime() + 7000))
        .build(),
    };

    const arrange_filter_by_name_sort_name_asc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { name: 'a' },
        },
        expected: {
          entities: [entitiesMap.actor_AAA, entitiesMap.actor_AaA],
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
          filter: { name: 'a' },
        },
        expected: {
          entities: [entitiesMap.actor_a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_actors_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { type: CastMemberTypes.ACTOR },
        },
        expected: {
          entities: [entitiesMap.actor_c, entitiesMap.actor_b],
          meta: {
            total: 5,
            current_page: 1,
            last_page: 3,
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
          filter: { type: CastMemberTypes.ACTOR },
        },
        expected: {
          entities: [entitiesMap.actor_AaA, entitiesMap.actor_AAA],
          meta: {
            total: 5,
            current_page: 2,
            last_page: 3,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_directors_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { type: CastMemberTypes.DIRECTOR },
        },
        expected: {
          entities: [entitiesMap.director_e, entitiesMap.director_f],
          meta: {
            total: 2,
            current_page: 1,
            last_page: 1,
            per_page: 2,
          },
        },
      },
    ];

    return {
      arrange: [
        ...arrange_filter_by_name_sort_name_asc,
        ...arrange_filter_actors_sort_by_created_desc,
        ...arrange_filter_directors_sort_by_created_desc,
      ],
      entitiesMap,
    };
  }
}
