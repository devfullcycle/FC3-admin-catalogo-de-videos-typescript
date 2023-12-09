import { CastMembersIdExistsInDatabaseValidator } from '../../../../cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Rating } from '../../../domain/rating.vo';
import { Video } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';
import { CreateVideoInput } from './create-video.input';

export class CreateVideoUseCase
  implements IUseCase<CreateVideoInput, CreateVideoOutput>
{
  constructor(
    private uow: IUnitOfWork,
    private videoRepo: IVideoRepository,
    private categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
    private genresIdValidator: GenresIdExistsInDatabaseValidator,
    private castMembersIdValidator: CastMembersIdExistsInDatabaseValidator,
  ) {}

  async execute(input: CreateVideoInput): Promise<CreateVideoOutput> {
    const [rating, errorRating] = Rating.create(input.rating).asArray();

    const [eitherCategoriesId, eitherGenresId, eitherCastMembers] =
      await Promise.all([
        await this.categoriesIdValidator.validate(input.categories_id),
        await this.genresIdValidator.validate(input.genres_id),
        await this.castMembersIdValidator.validate(input.cast_members_id),
      ]);

    const [categoriesId, errorsCategoriesId] = eitherCategoriesId.asArray();
    const [genresId, errorsGenresId] = eitherGenresId.asArray();
    const [castMembersId, errorsCastMembersId] = eitherCastMembers.asArray();

    const video = Video.create({
      ...input,
      rating,
      categories_id: errorsCategoriesId ? [] : categoriesId,
      genres_id: errorsGenresId ? [] : genresId,
      cast_members_id: errorsCastMembersId ? [] : castMembersId,
    });

    const notification = video.notification;

    if (errorsCategoriesId) {
      notification.setError(
        errorsCategoriesId.map((e) => e.message),
        'categories_id',
      );
    }

    if (errorsGenresId) {
      notification.setError(
        errorsGenresId.map((e) => e.message),
        'genres_id',
      );
    }

    if (errorsCastMembersId) {
      notification.setError(
        errorsCastMembersId.map((e) => e.message),
        'cast_members_id',
      );
    }

    if (errorRating) {
      notification.setError(errorRating.message, 'rating');
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    await this.uow.do(async () => {
      return this.videoRepo.insert(video);
    });

    return { id: video.video_id.id };
  }
}

export type CreateVideoOutput = { id: string };
