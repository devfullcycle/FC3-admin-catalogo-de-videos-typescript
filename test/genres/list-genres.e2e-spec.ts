import request from 'supertest';
import qs from 'qs';
import { IGenreRepository } from '../../src/core/genre/domain/genre.repository';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { ListGenresFixture } from '../../src/nest-modules/genres-module/testing/genre-fixture';
import { GENRES_PROVIDERS } from '../../src/nest-modules/genres-module/genres.providers';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';

describe('GenresController (e2e)', () => {
  describe('/genres (GET)', () => {
    describe('should return genres sorted by created_at when request query is empty', () => {
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();
      const { relations, entitiesMap, arrange } =
        ListGenresFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(
          Array.from(relations.categories.values()),
        );
        await genreRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $label',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const data = expected.entities.map((e) => ({
            id: e.genre_id.id,
            name: e.name,
            is_active: e.is_active,
            categories_id: expect.arrayContaining(
              Array.from(e.categories_id.keys()),
            ),
            categories: expect.arrayContaining(
              Array.from(relations.categories.values())
                .filter((c) => e.categories_id.has(c.category_id.id))
                .map((c) => ({
                  id: c.category_id.id,
                  name: c.name,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            created_at: e.created_at.toISOString(),
          }));
          const response = await request(nestApp.app.getHttpServer())
            .get(`/genres/?${queryParams}`)
            .expect(200);
          expect(response.body).toStrictEqual({
            data: data,
            meta: expected.meta,
          });
        },
      );
    });

    describe('should return genres using paginate, filter and sort', () => {
      let genreRepo: IGenreRepository;
      let categoryRepo: ICategoryRepository;

      const nestApp = startApp();
      const { relations, entitiesMap, arrange } =
        ListGenresFixture.arrangeUnsorted();

      beforeEach(async () => {
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(
          Array.from(relations.categories.values()),
        );
        await genreRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $label',
        async ({ send_data, expected }) => {
          const queryParams = qs.stringify(send_data as any);
          const data = expected.entities.map((e) => ({
            id: e.genre_id.id,
            name: e.name,
            is_active: e.is_active,
            categories_id: expect.arrayContaining(
              Array.from(e.categories_id.keys()),
            ),
            categories: expect.arrayContaining(
              Array.from(relations.categories.values())
                .filter((c) => e.categories_id.has(c.category_id.id))
                .map((c) => ({
                  id: c.category_id.id,
                  name: c.name,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            created_at: e.created_at.toISOString(),
          }));
          const response = await request(nestApp.app.getHttpServer())
            .get(`/genres/?${queryParams}`)
            .expect(200);
          expect(response.body).toStrictEqual({
            data: data,
            meta: expected.meta,
          });
        },
      );
    });
  });
});
