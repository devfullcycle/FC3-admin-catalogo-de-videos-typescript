import { Test, TestingModule } from '@nestjs/testing';
import { ICastMemberRepository } from '../../../core/cast-member/domain/cast-member.repository';
import { CastMembersController } from '../cast-members.controller';
import { CastMembersModule } from '../cast-members.module';
import { CreateCastMemberUseCase } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberUseCase } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { ListCastMembersUseCase } from '../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { GetCastMemberUseCase } from '../../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';
import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import { CastMemberCollectionPresenter } from '../cast-members.presenter';
import * as CastMemberProviders from '../cast-members.providers';
import {
  CreateCastMemberFixture,
  ListCastMembersFixture,
  UpdateCastMemberFixture,
} from '../testing/cast-member-fixtures';
import { DatabaseModule } from '../../database-module/database.module';
import { ConfigModule } from '../../config-module/config.module';
import { CastMemberOutputMapper } from '../../../core/cast-member/application/use-cases/common/cast-member-output';

describe('CastMembersController Integration Tests', () => {
  let controller: CastMembersController;
  let repository: ICastMemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get(CastMembersController);
    repository = module.get(
      CastMemberProviders.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCastMemberUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCastMemberUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCastMembersUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCastMemberUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCastMemberUseCase);
  });

  describe('should create a cast member', () => {
    const arrange = CreateCastMemberFixture.arrangeForCreate();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));

        expect(entity!.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });

        expect(presenter).toEqual(
          CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(entity!),
          ),
        );
      },
    );
  });

  describe('should update a cast member', () => {
    const arrange = UpdateCastMemberFixture.arrangeForUpdate();

    const castMember = CastMember.fake().anActor().build();
    beforeEach(async () => {
      await repository.insert(castMember);
    });

    test.each(arrange)(
      'with request $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          castMember.cast_member_id.id,
          send_data,
        );
        const entity = await repository.findById(new Uuid(presenter.id));

        expect(entity!.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          name: expected.name ?? castMember.name,
          type: expected.type ?? castMember.type.type,
        });
        expect(presenter).toEqual(
          CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(entity!),
          ),
        );
      },
    );
  });

  it('should delete a cast member', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const response = await controller.remove(castMember.entity_id.id);
    expect(response).not.toBeDefined();
    await expect(
      repository.findById(castMember.cast_member_id),
    ).resolves.toBeNull();
  });

  it('should get a cast member', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const presenter = await controller.findOne(castMember.cast_member_id.id);
    expect(presenter.id).toBe(castMember.cast_member_id.id);
    expect(presenter.name).toBe(castMember.name);
    expect(presenter.type).toBe(castMember.type.type);
    expect(presenter.created_at).toEqual(castMember.created_at);
  });

  describe('search method', () => {
    describe('should returns cast members using query empty ordered by created_at', () => {
      const { entitiesMap, arrange } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map(CastMemberOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should returns output using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCastMembersFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is {"filter": $send_data.filter, "page": $send_data.page, "per_page": $send_data.per_page, "sort": $send_data.sort, "sort_dir": $send_data.sort_dir}',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map(CastMemberOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
//cast-members?filter[type]=1
// Arquitetura em camadas

// Portas de entrada ----
// use cases
// coração do software
// infraestrutura

//Test Data Builders - Build Design Pattern
