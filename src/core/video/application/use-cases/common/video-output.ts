import { CastMemberTypes } from '../../../../cast-member/domain/cast-member-type.vo';
import { CastMember } from '../../../../cast-member/domain/cast-member.aggregate';
import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../../genre/domain/genre.aggregate';
import { RatingValues } from '../../../domain/rating.vo';
import { Video } from '../../../domain/video.aggregate';

export type VideoCategoryOutput = {
  id: string;
  name: string;
  created_at: Date;
};

export type VideoGenreOutput = {
  id: string;
  name: string;
  is_active: boolean;
  categories_id: string[];
  categories: { id: string; name: string; created_at: Date }[];
  created_at: Date;
};

export type VideoCastMemberOutput = {
  id: string;
  name: string;
  type: CastMemberTypes;
  created_at: Date;
};

export type VideoOutput = {
  id: string;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  categories: VideoCategoryOutput[];
  genres_id: string[];
  genres: VideoGenreOutput[];
  cast_members_id: string[];
  cast_members: VideoCastMemberOutput[];
  created_at: Date;
};

export type VideoOutputParams = {
  video: Video;
  allCategoriesOfVideoAndGenre: Category[];
  genres: Genre[];
  cast_members: CastMember[];
};

export class VideoOutputMapper {
  static toOutput({
    video,
    allCategoriesOfVideoAndGenre,
    genres,
    cast_members,
  }: VideoOutputParams): VideoOutput {
    return {
      id: video.video_id.id,
      title: video.title,
      description: video.description,
      year_launched: video.year_launched,
      duration: video.duration,
      rating: video.rating.value,
      is_opened: video.is_opened,
      is_published: video.is_published,
      categories_id: Array.from(video.categories_id.values()).map((c) => c.id),
      categories: allCategoriesOfVideoAndGenre
        .filter((c) => video.categories_id.has(c.category_id.id))
        .map((c) => ({
          id: c.category_id.id,
          name: c.name,
          created_at: c.created_at,
        })),
      genres_id: Array.from(video.genres_id.values()).map((g) => g.id),
      genres: VideoOutputMapper.toGenreVideoOutput(
        video,
        genres,
        allCategoriesOfVideoAndGenre,
      ),
      cast_members_id: Array.from(video.cast_members_id.values()).map(
        (c) => c.id,
      ),
      cast_members: cast_members
        .filter((c) => video.cast_members_id.has(c.cast_member_id.id))
        .map((c) => ({
          id: c.cast_member_id.id,
          name: c.name,
          type: c.type.type,
          created_at: c.created_at,
        })),
      created_at: video.created_at,
    };
  }

  private static toGenreVideoOutput(
    video: Video,
    genres: Genre[],
    categories: Category[],
  ) {
    return genres
      .filter((g) => video.genres_id.has(g.genre_id.id))
      .map((g) => ({
        id: g.genre_id.id,
        name: g.name,
        is_active: g.is_active,
        categories_id: Array.from(g.categories_id.values()).map((c) => c.id),
        categories: categories
          .filter((c) => g.categories_id.has(c.category_id.id))
          .map((c) => ({
            id: c.category_id.id,
            name: c.name,
            created_at: c.created_at,
          })),
        created_at: g.created_at,
      }));
  }
}
