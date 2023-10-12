import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from '../cast-member-type.vo';

describe('CastMemberType Unit Tests', () => {
  it('should return error when type is invalid', () => {
    const validateSpy = jest.spyOn(CastMemberType.prototype, 'validate' as any);
    const [vo, error] = CastMemberType.create('1' as any);
    expect(vo).toBeNull();
    expect(error).toEqual(new InvalidCastMemberTypeError('1'));
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a director', () => {
    const [vo1, error] = CastMemberType.create(
      CastMemberTypes.DIRECTOR,
    ).asArray();
    expect(error).toBeNull();
    expect(vo1).toBeInstanceOf(CastMemberType);
    expect(vo1.type).toBe(CastMemberTypes.DIRECTOR);

    const vo2 = CastMemberType.createADirector();
    expect(error).toBeNull();
    expect(vo2).toBeInstanceOf(CastMemberType);
    expect(vo2.type).toBe(CastMemberTypes.DIRECTOR);
  });

  it('should create an actor', () => {
    const [vo1, error] = CastMemberType.create(CastMemberTypes.ACTOR).asArray();
    expect(error).toBeNull();
    expect(vo1).toBeInstanceOf(CastMemberType);
    expect(vo1.type).toBe(CastMemberTypes.ACTOR);

    const vo2 = CastMemberType.createAnActor();
    expect(error).toBeNull();
    expect(vo2).toBeInstanceOf(CastMemberType);
    expect(vo2.type).toBe(CastMemberTypes.ACTOR);
  });
});
