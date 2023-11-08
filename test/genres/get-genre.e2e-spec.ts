import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { Genre } from '../../src/core/genre/domain/genre.aggregate';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { GenresController } from '../../src/nest-modules/genres-module/genres.controller';
import { GetGenreFixture } from '../../src/nest-modules/genres-module/testing/genre-fixture';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { GenreOutputMapper } from '../../src/core/genre/application/use-cases/common/genre-output';

describe('GenresController (e2e)', () => {
  const nestApp = startApp();
  describe('/genres/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Genre Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/genres/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a genre ', async () => {
      const genreRepo = nestApp.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );
      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const categories = Category.fake().theCategories(3).build();
      await categoryRepo.bulkInsert(categories);
      const genre = Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build();
      await genreRepo.insert(genre);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/genres/${genre.genre_id.id}`)
        .expect(200);
      const keyInResponse = GetGenreFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = GenresController.serialize(
        GenreOutputMapper.toOutput(genre, categories),
      );
      const serialized = instanceToPlain(presenter);
      serialized.categories_id = expect.arrayContaining(
        serialized.categories_id,
      );
      serialized.categories = expect.arrayContaining(
        serialized.categories.map((category) => ({
          id: category.id,
          name: category.name,
          created_at: category.created_at,
        })),
      );
      expect(res.body.data).toEqual(serialized);
    });
  });
});
