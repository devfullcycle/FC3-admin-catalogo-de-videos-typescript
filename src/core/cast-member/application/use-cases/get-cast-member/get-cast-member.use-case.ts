import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';

export class GetCastMemberUseCase
  implements IUseCase<GetCastMemberInput, GetCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: GetCastMemberInput): Promise<GetCastMemberOutput> {
    const castMemberId = new CastMemberId(input.id);
    const castMember = await this.castMemberRepo.findById(castMemberId);
    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }

    return CastMemberOutputMapper.toOutput(castMember);
  }
}

export type GetCastMemberInput = {
  id: string;
};

export type GetCastMemberOutput = CastMemberOutput;
