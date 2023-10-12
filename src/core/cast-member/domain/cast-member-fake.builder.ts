import { Chance } from 'chance';
import { CastMember, CastMemberId } from './cast-member.aggregate';
import { CastMemberType } from './cast-member-type.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class CastMemberFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _cast_member_id: PropOrFactory<CastMemberId> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _type: PropOrFactory<CastMemberType> = (_index) =>
    CastMemberType.createAnActor();
  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aDirector() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createADirector(),
    );
  }

  static anActor() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createAnActor(),
    );
  }

  static theActors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withType(
      CastMemberType.createAnActor(),
    );
  }

  static theDirectors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withType(
      CastMemberType.createADirector(),
    );
  }

  static theCastMembers(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withCastMemberId(valueOrFactory: PropOrFactory<CastMemberId>) {
    this._cast_member_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const castMembers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const castMember = new CastMember({
          cast_member_id: !this._cast_member_id
            ? undefined
            : this.callFactory(this._cast_member_id, index),
          name: this.callFactory(this._name, index),
          type: this.callFactory(this._type, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        });
        castMember.validate();
        return castMember;
      });
    return this.countObjs === 1 ? (castMembers[0] as any) : castMembers;
  }

  get cast_member_id() {
    return this.getValue('cast_member_id');
  }

  get name() {
    return this.getValue('name');
  }

  get type() {
    return this.getValue('type');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['cast_member_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
