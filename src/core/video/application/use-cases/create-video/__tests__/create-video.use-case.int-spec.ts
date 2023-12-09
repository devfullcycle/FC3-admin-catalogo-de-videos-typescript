import { CastMembersIdExistsInDatabaseValidator } from '../../../../../cast-member/application/validations/cast-members-ids-exists-in-database.validator';
import { CastMember } from '../../../../../cast-member/domain/cast-member.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '../../../../../cast-member/infra/db/sequelize/cast-member-sequelize';
import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { RatingValues } from '../../../../domain/rating.vo';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { setupSequelizeForVideo } from '../../../../infra/db/sequelize/testing/helpers';
import { VideoSequelizeRepository } from '../../../../infra/db/sequelize/video-sequelize.repository';
import { VideoModel } from '../../../../infra/db/sequelize/video.model';
import { CreateVideoUseCase } from '../create-video.use-case';

import { DatabaseError } from 'sequelize';
describe('CreateVideoUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: CreateVideoUseCase;

  let videoRepo: VideoSequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;

  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdsValidator: GenresIdExistsInDatabaseValidator;
  let castMembersIdsValidator: CastMembersIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    categoriesIdsValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdsValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    castMembersIdsValidator = new CastMembersIdExistsInDatabaseValidator(
      castMemberRepo,
    );
    useCase = new CreateVideoUseCase(
      uow,
      videoRepo,
      categoriesIdsValidator,
      genresIdsValidator,
      castMembersIdsValidator,
    );
  });

  it('should create a video', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);
    const castMembersId = castMembers.map((c) => c.cast_member_id.id);

    const output = await useCase.execute({
      title: 'test video',
      description: 'test description',
      year_launched: 2021,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    });
    expect(output).toStrictEqual({
      id: expect.any(String),
    });
    const video = await videoRepo.findById(new VideoId(output.id));
    expect(video!.toJSON()).toStrictEqual({
      video_id: expect.any(String),
      title: 'test video',
      description: 'test description',
      year_launched: 2021,
      duration: 90,
      rating: RatingValues.R10,
      is_opened: true,
      is_published: false,
      banner: null,
      thumbnail: null,
      thumbnail_half: null,
      trailer: null,
      video: null,
      categories_id: expect.arrayContaining(categoriesId),
      genres_id: expect.arrayContaining(genresId),
      cast_members_id: expect.arrayContaining(castMembersId),
      created_at: expect.any(Date),
    });
  });

  it('rollback transaction', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);
    const castMembersId = castMembers.map((c) => c.cast_member_id.id);

    const video = Video.fake().aVideoWithoutMedias().build();
    video.title = 't'.repeat(256);

    const mockCreate = jest
      .spyOn(Video, 'create')
      .mockImplementation(() => video);

    await expect(
      useCase.execute({
        title: 'test video',
        rating: RatingValues.R10,
        categories_id: categoriesId,
        genres_id: genresId,
        cast_members_id: castMembersId,
      } as any),
    ).rejects.toThrowError(DatabaseError);

    const videos = await videoRepo.findAll();
    expect(videos.length).toEqual(0);

    mockCreate.mockRestore();
  });
});
