import { ICastMemberRepository } from '../../../../cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Video, VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video-output';

export class GetVideoUseCase
  implements IUseCase<GetVideoInput, GetVideoOutput>
{
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}

  async execute(input: GetVideoInput): Promise<GetVideoOutput> {
    const videoId = new VideoId(input.id);
    const video = await this.videoRepo.findById(videoId);
    if (!video) {
      throw new NotFoundError(input.id, Video);
    }
    const genres = await this.genreRepo.findByIds(
      Array.from(video.genres_id.values()),
    );

    const categories = await this.categoryRepo.findByIds(
      Array.from(video.categories_id.values()).concat(
        genres.flatMap((g) => Array.from(g.categories_id.values())),
      ),
    );

    const castMembers = await this.castMemberRepo.findByIds(
      Array.from(video.cast_members_id.values()),
    );

    return VideoOutputMapper.toOutput({
      video,
      genres,
      cast_members: castMembers,
      allCategoriesOfVideoAndGenre: categories,
    });
  }
}

export type GetVideoInput = {
  id: string;
};

export type GetVideoOutput = VideoOutput;
