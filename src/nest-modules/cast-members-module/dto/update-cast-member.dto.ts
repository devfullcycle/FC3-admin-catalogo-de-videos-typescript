import { OmitType } from '@nestjs/mapped-types';
import { UpdateCastMemberInput } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';

export class UpdateCastMemberInputWithoutId extends OmitType(
  UpdateCastMemberInput,
  ['id'] as any,
) {}

export class UpdateCastMemberDto extends UpdateCastMemberInputWithoutId {}
