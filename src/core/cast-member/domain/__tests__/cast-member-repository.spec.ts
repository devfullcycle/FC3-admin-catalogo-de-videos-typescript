import { SearchValidationError } from '../../../shared/domain/validators/validation.error';
import { CastMemberTypes } from '../cast-member-type.vo';
import { CastMemberSearchParams } from '../cast-member.repository';

describe('CastMemberSearchParams', () => {
  describe('create', () => {
    it('should create a new instance with default values', () => {
      const searchParams = CastMemberSearchParams.create();

      expect(searchParams).toBeInstanceOf(CastMemberSearchParams);
      expect(searchParams.filter).toBeNull();
    });

    it('should create a new instance with provided values', () => {
      const searchParams = CastMemberSearchParams.create({
        filter: {
          name: 'John Doe',
          type: CastMemberTypes.ACTOR,
        },
      });

      expect(searchParams).toBeInstanceOf(CastMemberSearchParams);
      expect(searchParams.filter!.name).toBe('John Doe');
      expect(searchParams.filter!.type!.type).toBe(CastMemberTypes.ACTOR);
    });

    it('should throw an error if the provided type is invalid', () => {
      expect(() =>
        CastMemberSearchParams.create({
          filter: {
            type: 'invalid-type' as any,
          },
        }),
      ).toThrowError(SearchValidationError);
    });
  });
});
