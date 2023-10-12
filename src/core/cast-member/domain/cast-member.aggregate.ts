import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import CastMemberValidatorFactory from './cast-member.validator';
import { CastMemberType } from './cast-member-type.vo';
import { CastMemberFakeBuilder } from './cast-member-fake.builder';
import { AggregateRoot } from '../../shared/domain/aggregate-root';

export type CastMemberConstructorProps = {
  cast_member_id?: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberCreateCommand = {
  name: string;
  type: CastMemberType;
};

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at: Date;

  constructor(props: CastMemberConstructorProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CastMemberCreateCommand) {
    const castMember = new CastMember(props);
    castMember.validate(['name']);
    return castMember;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeType(type: CastMemberType): void {
    this.type = type;
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  get entity_id() {
    return this.cast_member_id;
  }

  toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      name: this.name,
      type: this.type.type,
      created_at: this.created_at,
    };
  }
}
