import { Either } from '../../../shared/domain/either';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Genre, GenreId } from '../../domain/genre.aggregate';
import { IGenreRepository } from '../../domain/genre.repository';

export class GenresIdExistsInDatabaseValidator {
  constructor(private genreRepo: IGenreRepository) {}

  async validate(
    genres_id: string[],
  ): Promise<Either<GenreId[], NotFoundError[]>> {
    const genresId = genres_id.map((v) => new GenreId(v));

    const existsResult = await this.genreRepo.existsById(genresId);
    return existsResult.not_exists.length > 0
      ? Either.fail(
          existsResult.not_exists.map((c) => new NotFoundError(c.id, Genre)),
        )
      : Either.ok(genresId);
  }
}
