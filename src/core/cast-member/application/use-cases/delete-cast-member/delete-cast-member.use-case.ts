import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const castMemberId = new CastMemberId(input.id);
    await this.castMemberRepository.delete(castMemberId);
  }
}

export type DeleteCastMemberInput = {
  id: string;
};

type DeleteCastMemberOutput = void;
