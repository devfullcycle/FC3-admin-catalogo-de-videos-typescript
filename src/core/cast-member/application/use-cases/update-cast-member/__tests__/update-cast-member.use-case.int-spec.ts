import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '../../../../infra/db/sequelize/cast-member-sequelize';
import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';
import { UpdateCastMemberInput } from '../update-cast-member.input';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    await expect(() =>
      useCase.execute(
        new UpdateCastMemberInput({ id: castMemberId.id, name: 'fake' }),
      ),
    ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
  });

  it('should update a cast member', async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    let output = await useCase.execute(
      new UpdateCastMemberInput({
        id: entity.cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.ACTOR,
      }),
    );
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberTypes.ACTOR,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        type: CastMemberTypes;
      };
      expected: {
        id: string;
        name: string;
        type: CastMemberTypes;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberTypes.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberTypes.DIRECTOR,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        type: i.input.type,
      });
      const entityUpdated = await repository.findById(
        new CastMemberId(i.input.id),
      );
      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        cast_member_id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
