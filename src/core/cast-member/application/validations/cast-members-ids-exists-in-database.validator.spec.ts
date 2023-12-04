import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { CastMember, CastMemberId } from '../../domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from '../../infra/db/in-memory/cast-member-in-memory.repository';
import { CastMembersIdExistsInDatabaseValidator } from './cast-members-ids-exists-in-database.validator';

describe('CastMembersIdExistsInDatabaseValidator Unit Tests', () => {
  let castMemberRepo: CastMemberInMemoryRepository;
  let validator: CastMembersIdExistsInDatabaseValidator;
  beforeEach(() => {
    castMemberRepo = new CastMemberInMemoryRepository();
    validator = new CastMembersIdExistsInDatabaseValidator(castMemberRepo);
  });

  it('should return many not found error when cast members id is not exists in storage', async () => {
    const castMemberId1 = new CastMemberId();
    const castMemberId2 = new CastMemberId();
    const spyExistsById = jest.spyOn(castMemberRepo, 'existsById');
    let [castMembersId, errorsCastMembersId] = await validator.validate([
      castMemberId1.id,
      castMemberId2.id,
    ]);
    expect(castMembersId).toStrictEqual(null);
    expect(errorsCastMembersId).toStrictEqual([
      new NotFoundError(castMemberId1.id, CastMember),
      new NotFoundError(castMemberId2.id, CastMember),
    ]);

    expect(spyExistsById).toHaveBeenCalledTimes(1);

    const castMember1 = CastMember.fake().aDirector().build();
    await castMemberRepo.insert(castMember1);

    [castMembersId, errorsCastMembersId] = await validator.validate([
      castMember1.cast_member_id.id,
      castMemberId2.id,
    ]);
    expect(castMembersId).toStrictEqual(null);
    expect(errorsCastMembersId).toStrictEqual([
      new NotFoundError(castMemberId2.id, CastMember),
    ]);
    expect(spyExistsById).toHaveBeenCalledTimes(2);
  });

  it('should return a list of categories id', async () => {
    const castMember1 = CastMember.fake().aDirector().build();
    const castMember2 = CastMember.fake().aDirector().build();
    await castMemberRepo.bulkInsert([castMember1, castMember2]);
    const [castMembersId, errorsCastMembersId] = await validator.validate([
      castMember1.cast_member_id.id,
      castMember2.cast_member_id.id,
    ]);
    expect(castMembersId).toHaveLength(2);
    expect(errorsCastMembersId).toStrictEqual(null);
    expect(castMembersId[0]).toBeValueObject(castMember1.cast_member_id);
    expect(castMembersId[1]).toBeValueObject(castMember2.cast_member_id);
  });
});
