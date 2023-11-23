import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { Genre, GenreId } from '../../src/core/genre/domain/genre.aggregate';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { UpdateGenreFixture } from '../../src/nest-modules/genres-module/testing/genre-fixture';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { GenresController } from '../../src/nest-modules/genres-module/genres.controller';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { Category } from '../../src/core/category/domain/category.aggregate';
import { GenreOutputMapper } from '../../src/core/genre/application/use-cases/common/genre-output';

describe('GenresController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/genres/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Genre.fake().aGenre();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message:
              'Genre Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/genres/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateGenreFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/genres/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp();
      const validationErrors =
        UpdateGenreFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationErrors).map((key) => ({
        label: key,
        value: validationErrors[key],
      }));
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;

      beforeEach(() => {
        genreRepo = app.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = app.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepo.insert(category);
        const genre = Genre.fake()
          .aGenre()
          .addCategoryId(category.category_id)
          .build();
        await genreRepo.insert(genre);
        return request(app.app.getHttpServer())
          .patch(`/genres/${genre.genre_id.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a genre', () => {
      const app = startApp();
      const arrange = UpdateGenreFixture.arrangeForSave();
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;
      beforeEach(async () => {
        genreRepo = app.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = app.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected, relations }) => {
          const category = Category.fake().aCategory().build();
          await categoryRepo.bulkInsert([category, ...relations.categories]);
          const genreCreated = Genre.fake()
            .aGenre()
            .addCategoryId(category.category_id)
            .build();
          await genreRepo.insert(genreCreated);

          const res = await request(app.app.getHttpServer())
            .patch(`/genres/${genreCreated.genre_id.id}`)
            .send(send_data)
            .expect(200);

          const keyInResponse = UpdateGenreFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const genreUpdated = await genreRepo.findById(new GenreId(id));
          const presenter = GenresController.serialize(
            GenreOutputMapper.toOutput(genreUpdated!, relations.categories),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
