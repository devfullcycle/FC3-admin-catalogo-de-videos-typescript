import { CastMemberType } from '../cast-member-type.vo';
import { CastMember, CastMemberId } from '../cast-member.aggregate';

describe('CastMember Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest
      .fn()
      .mockImplementation(CastMember.prototype.validate);
  });
  test('constructor of cast member', () => {
    const director = CastMemberType.createADirector();
    let castMember = new CastMember({
      name: 'test',
      type: director,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    expect(castMember.name).toBe('test');
    expect(castMember.type).toEqual(director);
    expect(castMember.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    castMember = new CastMember({
      name: 'test',
      type: director,
      created_at,
    });
    expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    expect(castMember.name).toBe('test');
    expect(castMember.type).toEqual(director);
    expect(castMember.created_at).toBe(created_at);
  });

  describe('id field', () => {
    const actor = CastMemberType.createADirector();
    const arrange = [
      { name: 'Movie', type: actor },
      { name: 'Movie', type: actor, id: null },
      { name: 'Movie', type: actor, id: undefined },
      { name: 'Movie', type: actor, id: new CastMemberId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const castMember = new CastMember(item);
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    });
  });

  describe('create command', () => {
    test('should create a cast member', () => {
      const actor = CastMemberType.createADirector();
      const castMember = CastMember.create({
        name: 'test',
        type: actor,
      });
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMember.name).toBe('test');
      expect(castMember.type).toEqual(actor);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
      expect(castMember.notification.hasErrors()).toBe(false);
    });
  });

  describe('cast_member_id field', () => {
    const arrange = [
      { id: null },
      { id: undefined },
      { id: new CastMemberId() },
    ];

    test.each(arrange)('should be is %j', (props) => {
      const castMember = new CastMember(props as any);
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    });
  });

  test('should change name', () => {
    const actor = CastMemberType.createADirector();
    const castMember = CastMember.create({
      name: 'test',
      type: actor,
    });
    castMember.changeName('new name');
    expect(castMember.name).toBe('new name');
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(2);
    expect(castMember.notification.hasErrors()).toBe(false);
  });

  test('should change type', () => {
    const actor = CastMemberType.createADirector();
    const castMember = CastMember.create({
      name: 'test',
      type: actor,
    });
    const director = CastMemberType.createADirector();
    castMember.changeType(director);
    expect(castMember.type).toEqual(director);
    expect(CastMember.prototype.validate).toHaveBeenCalledTimes(1);
  });
});

describe('CastMember Validator', () => {
  describe('create command', () => {
    test('should an invalid cast member with name property', () => {
      const castMember = CastMember.create({ name: 't'.repeat(256) } as any);
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid cast member using name property', () => {
      const castMember = CastMember.fake().aDirector().build();
      castMember.changeName('t'.repeat(256));
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
