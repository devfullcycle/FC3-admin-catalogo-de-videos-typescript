import { CastMember } from '../../../../cast-member/domain/cast-member.aggregate';
import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../../genre/domain/genre.aggregate';
import { Video } from '../../../domain/video.aggregate';
import { VideoOutputMapper } from './video-output';

describe('VideoOutputMapper Unit Tests', () => {
  describe('genreToOutput method', () => {
    it('should return an empty array if no genres match', () => {
      const video = Video.fake().aVideoWithAllMedias().build();
      const output = VideoOutputMapper['toGenreVideoOutput'](video, [], []);
      expect(output).toEqual([]);
    });

    it('should return an array of genres that match the video', () => {
      const categories = Category.fake().theCategories(2).build();
      const genres = Genre.fake().theGenres(2).build();
      genres[0].syncCategoriesId([categories[0].category_id]);
      genres[1].syncCategoriesId([categories[1].category_id]);
      const video = Video.fake()
        .aVideoWithAllMedias()
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .build();
      const output = VideoOutputMapper['toGenreVideoOutput'](
        video,
        genres,
        categories,
      );
      expect(output).toEqual([
        {
          id: genres[0].genre_id.id,
          name: genres[0].name,
          is_active: genres[0].is_active,
          categories_id: [categories[0].category_id.id],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
          ],
          created_at: genres[0].created_at,
        },
        {
          id: genres[1].genre_id.id,
          name: genres[1].name,
          is_active: genres[1].is_active,
          categories_id: [categories[1].category_id.id],
          categories: [
            {
              id: categories[1].category_id.id,
              name: categories[1].name,
              created_at: categories[1].created_at,
            },
          ],
          created_at: genres[1].created_at,
        },
      ]);
    });
  });
  it('should convert a video in output', () => {
    const categories = Category.fake().theCategories(2).build();
    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    const castMembers = CastMember.fake().theCastMembers(2).build();

    const entity = Video.fake()
      .aVideoWithAllMedias()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addGenreId(genres[0].genre_id)
      .addGenreId(genres[1].genre_id)
      .addCastMemberId(castMembers[0].cast_member_id)
      .addCastMemberId(castMembers[1].cast_member_id)
      .build();
    const output = VideoOutputMapper.toOutput({
      video: entity,
      genres,
      cast_members: castMembers,
      allCategoriesOfVideoAndGenre: categories,
    });
    expect(output).toEqual({
      id: entity.video_id.id,
      title: entity.title,
      description: entity.description,
      year_launched: entity.year_launched,
      duration: entity.duration,
      rating: entity.rating.value,
      is_opened: entity.is_opened,
      is_published: entity.is_published,
      categories_id: [
        categories[0].category_id.id,
        categories[1].category_id.id,
      ],
      categories: [
        {
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        },
        {
          id: categories[1].category_id.id,
          name: categories[1].name,
          created_at: categories[1].created_at,
        },
      ],
      genres_id: [genres[0].genre_id.id, genres[1].genre_id.id],
      genres: [
        {
          id: genres[0].genre_id.id,
          name: genres[0].name,
          is_active: genres[0].is_active,
          categories_id: [categories[0].category_id.id],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
          ],
          created_at: genres[0].created_at,
        },
        {
          id: genres[1].genre_id.id,
          name: genres[1].name,
          is_active: genres[1].is_active,
          categories_id: [categories[1].category_id.id],
          categories: [
            {
              id: categories[1].category_id.id,
              name: categories[1].name,
              created_at: categories[1].created_at,
            },
          ],
          created_at: genres[1].created_at,
        },
      ],
      cast_members_id: [
        castMembers[0].cast_member_id.id,
        castMembers[1].cast_member_id.id,
      ],
      cast_members: [
        {
          id: castMembers[0].cast_member_id.id,
          name: castMembers[0].name,
          type: castMembers[0].type.type,
          created_at: castMembers[0].created_at,
        },
        {
          id: castMembers[1].cast_member_id.id,
          name: castMembers[1].name,
          type: castMembers[1].type.type,
          created_at: castMembers[1].created_at,
        },
      ],
      created_at: entity.created_at,
    });
  });
});
