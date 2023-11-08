import { Either } from '../../../shared/domain/either';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Category, CategoryId } from '../../domain/category.aggregate';
import { ICategoryRepository } from '../../domain/category.repository';

export class CategoriesIdExistsInDatabaseValidator {
  constructor(private categoryRepo: ICategoryRepository) {}

  async validate(
    categories_id: string[],
  ): Promise<Either<CategoryId[], NotFoundError[]>> {
    const categoriesId = categories_id.map((v) => new CategoryId(v));

    const existsResult = await this.categoryRepo.existsById(categoriesId);
    return existsResult.not_exists.length > 0
      ? Either.fail(
          existsResult.not_exists.map((c) => new NotFoundError(c.id, Category)),
        )
      : Either.ok(categoriesId);
  }
}
