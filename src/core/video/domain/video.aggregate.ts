import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CategoryId } from '../../category/domain/category.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { CastMemberId } from '../../cast-member/domain/cast-member.aggregate';
import { Rating } from './rating.vo';
import { Banner } from './banner.vo';
import { Thumbnail } from './thumbnail.vo';
import { Trailer } from './trailer.vo';
import { VideoMedia } from './video-media.vo';
import VideoValidatorFactory from './video.validator';
import { ThumbnailHalf } from './thumbnail-half.vo';
import { AudioVideoMediaStatus } from '../../shared/domain/value-objects/audio-video-media.vo';
import { VideoFakeBuilder } from './video-fake.builder';
import { VideoCreatedEvent } from './domain-events/video-created.event';
import { VideoAudioMediaReplaced } from './domain-events/video-audio-media-replaced.event';

export type VideoConstructorProps = {
  video_id?: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean;

  banner?: Banner | null;
  thumbnail?: Thumbnail | null;
  thumbnail_half?: ThumbnailHalf | null;
  trailer?: Trailer | null;
  video?: VideoMedia | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;
  created_at?: Date;
};

export type VideoCreateCommand = {
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;

  banner?: Banner;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;
  trailer?: Trailer;
  video?: VideoMedia;

  categories_id: CategoryId[];
  genres_id: GenreId[];
  cast_members_id: CastMemberId[];
};

export class VideoId extends Uuid {}

export class Video extends AggregateRoot {
  video_id: VideoId;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: Rating;
  is_opened: boolean;
  is_published: boolean; //uploads

  banner: Banner | null;
  thumbnail: Thumbnail | null;
  thumbnail_half: ThumbnailHalf | null;
  trailer: Trailer | null;
  video: VideoMedia | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  cast_members_id: Map<string, CastMemberId>;

  created_at: Date;

  constructor(props: VideoConstructorProps) {
    super();
    this.video_id = props.video_id ?? new VideoId();
    this.title = props.title;
    this.description = props.description;
    this.year_launched = props.year_launched;
    this.duration = props.duration;
    this.rating = props.rating;
    this.is_opened = props.is_opened;
    this.is_published = props.is_published;

    this.banner = props.banner ?? null;
    this.thumbnail = props.thumbnail ?? null;
    this.thumbnail_half = props.thumbnail_half ?? null;
    this.trailer = props.trailer ?? null;
    this.video = props.video ?? null;

    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.cast_members_id = props.cast_members_id;
    this.created_at = props.created_at ?? new Date();

    this.registerHandler(
      VideoCreatedEvent.name,
      this.onVideoCreated.bind(this),
    );
    this.registerHandler(
      VideoAudioMediaReplaced.name,
      this.onAudioVideoMediaReplaced.bind(this),
    );
  }

  static create(props: VideoCreateCommand) {
    const video = new Video({
      ...props,
      categories_id: new Map(props.categories_id.map((id) => [id.id, id])),
      genres_id: new Map(props.genres_id.map((id) => [id.id, id])),
      cast_members_id: new Map(props.cast_members_id.map((id) => [id.id, id])),
      is_published: false,
    });
    video.validate(['title']);
    video.applyEvent(
      new VideoCreatedEvent({
        video_id: video.video_id,
        title: video.title,
        description: video.description,
        year_launched: video.year_launched,
        duration: video.duration,
        rating: video.rating,
        is_opened: video.is_opened,
        is_published: video.is_published,
        banner: video.banner,
        thumbnail: video.thumbnail,
        thumbnail_half: video.thumbnail_half,
        trailer: video.trailer,
        video: video.video,
        categories_id: Array.from(video.categories_id.values()),
        genres_id: Array.from(video.genres_id.values()),
        cast_members_id: Array.from(video.cast_members_id.values()),
        created_at: video.created_at,
      }),
    );
    return video;
  }

  changeTitle(title: string): void {
    this.title = title;
    this.validate(['title']);
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  changeYearLaunched(yearLaunched: number): void {
    this.year_launched = yearLaunched;
  }

  changeDuration(duration: number): void {
    this.duration = duration;
  }

  changeRating(rating: Rating): void {
    this.rating = rating;
  }

  markAsOpened(): void {
    this.is_opened = true;
  }

  markAsNotOpened(): void {
    this.is_opened = false;
  }

  replaceBanner(banner: Banner): void {
    this.banner = banner;
  }

  replaceThumbnail(thumbnail: Thumbnail): void {
    this.thumbnail = thumbnail;
  }

  replaceThumbnailHalf(thumbnailHalf: ThumbnailHalf): void {
    this.thumbnail_half = thumbnailHalf;
  }

  replaceTrailer(trailer: Trailer): void {
    this.trailer = trailer;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: trailer,
        media_type: 'trailer',
      }),
    );
  }

  replaceVideo(video: VideoMedia): void {
    this.video = video;
    this.applyEvent(
      new VideoAudioMediaReplaced({
        aggregate_id: this.video_id,
        media: video,
        media_type: 'video',
      }),
    );
  }

  addCategoryId(categoryId: CategoryId): void {
    this.categories_id.set(categoryId.id, categoryId);
  }

  removeCategoryId(categoryId: CategoryId): void {
    this.categories_id.delete(categoryId.id);
  }

  syncCategoriesId(categoriesId: CategoryId[]): void {
    if (!categoriesId.length) {
      throw new Error('Categories id is empty');
    }

    this.categories_id = new Map(categoriesId.map((id) => [id.id, id]));
  }

  addGenreId(genreId: GenreId): void {
    this.genres_id.set(genreId.id, genreId);
  }

  removeGenreId(genreId: GenreId): void {
    this.genres_id.delete(genreId.id);
  }

  syncGenresId(genresId: GenreId[]): void {
    if (!genresId.length) {
      throw new Error('Genres id is empty');
    }
    this.genres_id = new Map(genresId.map((id) => [id.id, id]));
  }

  addCastMemberId(castMemberId: CastMemberId): void {
    this.cast_members_id.set(castMemberId.id, castMemberId);
  }

  removeCastMemberId(castMemberId: CastMemberId): void {
    this.cast_members_id.delete(castMemberId.id);
  }

  syncCastMembersId(castMembersId: CastMemberId[]): void {
    if (!castMembersId.length) {
      throw new Error('Cast Members id is empty');
    }
    this.cast_members_id = new Map(castMembersId.map((id) => [id.id, id]));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onVideoCreated(_event: VideoCreatedEvent) {
    if (this.is_published) {
      return;
    }

    this.tryMarkAsPublished();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAudioVideoMediaReplaced(_event: VideoAudioMediaReplaced) {
    if (this.is_published) {
      return;
    }

    this.tryMarkAsPublished();
  }

  private tryMarkAsPublished() {
    if (
      this.trailer &&
      this.video &&
      this.trailer.status === AudioVideoMediaStatus.COMPLETED &&
      this.video.status === AudioVideoMediaStatus.COMPLETED
    ) {
      this.is_published = true;
    }
  }

  validate(fields?: string[]) {
    const validator = VideoValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return VideoFakeBuilder;
  }

  get entity_id() {
    return this.video_id;
  }

  toJSON() {
    return {
      video_id: this.video_id.id,
      title: this.title,
      description: this.description,
      year_launched: this.year_launched,
      duration: this.duration,
      rating: this.rating.value,
      is_opened: this.is_opened,
      is_published: this.is_published,
      banner: this.banner ? this.banner.toJSON() : null,
      thumbnail: this.thumbnail ? this.thumbnail.toJSON() : null,
      thumbnail_half: this.thumbnail_half ? this.thumbnail_half.toJSON() : null,
      trailer: this.trailer ? this.trailer.toJSON() : null,
      video: this.video ? this.video.toJSON() : null,
      categories_id: Array.from(this.categories_id.values()).map((id) => id.id),
      genres_id: Array.from(this.genres_id.values()).map((id) => id.id),
      cast_members_id: Array.from(this.cast_members_id.values()).map(
        (id) => id.id,
      ),
      created_at: this.created_at,
    };
  }
}
