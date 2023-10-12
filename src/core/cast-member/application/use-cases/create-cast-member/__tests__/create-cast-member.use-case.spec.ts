import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberInput } from '../create-cast-member.input';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
    jest.restoreAllMocks();
  });

  describe('execute method', () => {
    it('should throw an generic error', async () => {
      const expectedError = new Error('generic error');
      jest.spyOn(repository, 'insert').mockRejectedValue(expectedError);
      await expect(
        useCase.execute({
          name: 'test',
          type: CastMemberTypes.ACTOR,
        }),
      ).rejects.toThrowError(expectedError);
    });

    it('should throw an entity validation error', async () => {
      try {
        await useCase.execute(
          new CreateCastMemberInput({
            name: 'cast',
            type: 'a' as any,
          }),
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.error).toStrictEqual([
          {
            type: ['Invalid cast member type: a'],
          },
        ]);
      }
      expect.assertions(2);
    });

    it('should create a cast member', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      let output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.ACTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: repository.items[0].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.ACTOR,
        created_at: repository.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: repository.items[1].cast_member_id.id,
        name: 'test',
        type: CastMemberTypes.DIRECTOR,
        created_at: repository.items[1].created_at,
      });
    });
  });
});
