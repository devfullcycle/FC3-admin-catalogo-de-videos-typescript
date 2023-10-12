import { IUseCase } from '../../../../shared/application/use-case.interface';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import { CastMember } from '../../../domain/cast-member.aggregate';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CreateCastMemberInput } from './create-cast-member.input';

export class CreateCastMemberUseCase
  implements IUseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
    const [type, errorCastMemberType] = CastMemberType.create(
      input.type,
    ).asArray();
    const entity = CastMember.create({
      ...input,
      type,
    });
    const notification = entity.notification;
    if (errorCastMemberType) {
      notification.setError(errorCastMemberType.message, 'type');
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    await this.castMemberRepo.insert(entity);
    return CastMemberOutputMapper.toOutput(entity);
  }
}

export type CreateCastMemberOutput = CastMemberOutput;
