import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberOutputMapper } from './cast-member-output';

describe('CastMemberOutputMapper Unit Tests', () => {
  it('should convert a cast member in output', () => {
    const entity = CastMember.create({
      name: 'Movie',
      type: CastMemberType.createAnActor(),
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CastMemberOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'Movie',
      type: CastMemberType.createAnActor().type,
      created_at: entity.created_at,
    });
  });
});
