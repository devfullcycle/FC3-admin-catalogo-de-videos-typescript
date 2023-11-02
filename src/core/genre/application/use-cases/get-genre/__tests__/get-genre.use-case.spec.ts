import { Category } from '../../../../../category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import { GenreInMemoryRepository } from '../../../../infra/db/in-memory/genre-in-memory.repository';
import { GetGenreUseCase } from '../get-genre.use-case';

describe('GetGenreUseCase Unit Tests', () => {
  let useCase: GetGenreUseCase;
  let genreRepo: GenreInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;

  beforeEach(() => {
    genreRepo = new GenreInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    useCase = new GetGenreUseCase(genreRepo, categoryRepo);
  });

  it('should throws error when entity not found', async () => {
    const genreId = new GenreId();
    await expect(() => useCase.execute({ id: genreId.id })).rejects.toThrow(
      new NotFoundError(genreId.id, Genre),
    );
  });

  it('should returns a genre', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[2].category_id)
      .build();
    genreRepo.items = [genre];
    const spyGenreFindById = jest.spyOn(genreRepo, 'findById');
    const spyCategoryFindByIds = jest.spyOn(categoryRepo, 'findByIds');
    const output = await useCase.execute({ id: genre.genre_id.id });
    expect(spyGenreFindById).toHaveBeenCalledTimes(1);
    expect(spyCategoryFindByIds).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: genre.genre_id.id,
      name: genre.name,
      categories: [
        {
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        },
        {
          id: categories[2].category_id.id,
          name: categories[2].name,
          created_at: categories[2].created_at,
        },
      ],
      categories_id: [...genre.categories_id.keys()],
      is_active: true,
      created_at: genre.created_at,
    });
  });
});
