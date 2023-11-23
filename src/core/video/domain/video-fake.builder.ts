import { Chance } from 'chance';
import { Video, VideoId } from './video.aggregate';
import { CategoryId } from '../../category/domain/category.aggregate';
import { Rating } from './rating.vo';
import { ImageMedia } from '../../shared/domain/value-objects/image-media.vo';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { CastMemberId } from '../../cast-member/domain/cast-member.aggregate';
import { Banner } from './banner.vo';
import { Thumbnail } from './thumbnail.vo';
import { ThumbnailHalf } from './thumbnail-half.vo';
import { Trailer } from './trailer.vo';
import { VideoMedia } from './video-media.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class VideoFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _video_id: PropOrFactory<VideoId> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _title: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _description: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _year_launched: PropOrFactory<number> = (_index) =>
    +this.chance.year();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _duration: PropOrFactory<number> = (_index) =>
    this.chance.integer({ min: 1, max: 100 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _rating: PropOrFactory<Rating> = (_index) => Rating.createRL();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _opened: PropOrFactory<boolean> = (_index) => true;
  private _banner: PropOrFactory<Banner | null> | undefined = new Banner({
    name: 'test-name-banner.png',
    location: 'test path banner',
  });
  private _thumbnail: PropOrFactory<Thumbnail | null> | undefined =
    new Thumbnail({
      name: 'test-name-thumbnail.png',
      location: 'test path thumbnail',
    });
  private _thumbnail_half: PropOrFactory<ThumbnailHalf | null> | undefined =
    new ThumbnailHalf({
      name: 'test-name-thumbnail-half.png',
      location: 'test path thumbnail half',
    });
  private _trailer: PropOrFactory<Trailer | null> | undefined = Trailer.create({
    name: 'test-name-trailer.mp4',
    raw_location: 'test path trailer',
  });
  private _video: PropOrFactory<VideoMedia | null> | undefined =
    VideoMedia.create({
      name: 'test-name-video.mp4',
      raw_location: 'test path video',
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _categories_id: PropOrFactory<CategoryId>[] = [];
  private _genres_id: PropOrFactory<GenreId>[] = [];
  private _cast_members_id: PropOrFactory<CastMemberId>[] = [];

  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aVideoWithoutMedias() {
    return new VideoFakeBuilder<Video>()
      .withoutBanner()
      .withoutThumbnail()
      .withoutThumbnailHalf()
      .withoutTrailer()
      .withoutVideo();
  }

  static aVideoWithAllMedias() {
    return new VideoFakeBuilder<Video>();
  }

  static theVideosWithoutMedias(countObjs: number) {
    return new VideoFakeBuilder<Video[]>(countObjs)
      .withoutBanner()
      .withoutThumbnail()
      .withoutThumbnailHalf()
      .withoutTrailer()
      .withoutVideo();
  }

  static theVideosWithAllMedias(countObjs: number) {
    return new VideoFakeBuilder<Video[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withVideoId(valueOrFactory: PropOrFactory<VideoId>) {
    this._video_id = valueOrFactory;
    return this;
  }

  withTitle(valueOrFactory: PropOrFactory<string>) {
    this._title = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string>) {
    this._description = valueOrFactory;
    return this;
  }

  withYearLaunched(valueOrFactory: PropOrFactory<number>) {
    this._year_launched = valueOrFactory;
    return this;
  }

  withDuration(valueOrFactory: PropOrFactory<number>) {
    this._duration = valueOrFactory;
    return this;
  }

  withRating(valueOrFactory: PropOrFactory<Rating>) {
    this._rating = valueOrFactory;
    return this;
  }

  withMarkAsOpened() {
    this._opened = true;
    return this;
  }

  withMarkAsNotOpened() {
    this._opened = false;
    return this;
  }

  withBanner(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._banner = valueOrFactory;
    return this;
  }

  withoutBanner() {
    this._banner = null;
    return this;
  }

  withThumbnail(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._thumbnail = valueOrFactory;
    return this;
  }

  withoutThumbnail() {
    this._thumbnail = null;
    return this;
  }

  withThumbnailHalf(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._thumbnail_half = valueOrFactory;
    return this;
  }

  withoutThumbnailHalf() {
    this._thumbnail_half = null;
    return this;
  }

  withTrailer(valueOrFactory: PropOrFactory<Trailer | null>) {
    this._trailer = valueOrFactory;
    return this;
  }

  withTrailerComplete() {
    this._trailer = Trailer.create({
      name: 'test name trailer',
      raw_location: 'test path trailer',
    }).complete('test encoded_location trailer');
    return this;
  }

  withoutTrailer() {
    this._trailer = null;
    return this;
  }

  withVideo(valueOrFactory: PropOrFactory<VideoMedia | null>) {
    this._video = valueOrFactory;
    return this;
  }

  withVideoComplete() {
    this._video = VideoMedia.create({
      name: 'test name video',
      raw_location: 'test path video',
    }).complete('test encoded_location video');
    return this;
  }

  withoutVideo() {
    this._video = null;
    return this;
  }

  addCategoryId(valueOrFactory: PropOrFactory<CategoryId>) {
    this._categories_id.push(valueOrFactory);
    return this;
  }

  addGenreId(valueOrFactory: PropOrFactory<GenreId>) {
    this._genres_id.push(valueOrFactory);
    return this;
  }

  addCastMemberId(valueOrFactory: PropOrFactory<CastMemberId>) {
    this._cast_members_id.push(valueOrFactory);
    return this;
  }

  withInvalidTitleTooLong(value?: string) {
    this._title = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const videos = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const categoryId = new CategoryId();
      const categoriesId = this._categories_id.length
        ? this.callFactory(this._categories_id, index)
        : [categoryId];

      const genreId = new GenreId();
      const genresId = this._genres_id.length
        ? this.callFactory(this._genres_id, index)
        : [genreId];

      const castMemberId = new CastMemberId();
      const castMembersId = this._cast_members_id.length
        ? this.callFactory(this._cast_members_id, index)
        : [castMemberId];

      const video = Video.create({
        title: this.callFactory(this._title, index),
        description: this.callFactory(this._description, index),
        year_launched: this.callFactory(this._year_launched, index),
        duration: this.callFactory(this._duration, index),
        rating: this.callFactory(this._rating, index),
        is_opened: this.callFactory(this._opened, index),
        banner: this.callFactory(this._banner, index),
        thumbnail: this.callFactory(this._thumbnail, index),
        thumbnail_half: this.callFactory(this._thumbnail_half, index),
        trailer: this.callFactory(this._trailer, index),
        video: this.callFactory(this._video, index),
        categories_id: categoriesId,
        genres_id: genresId,
        cast_members_id: castMembersId,
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });
      video['video_id'] = !this._video_id
        ? video['video_id']
        : this.callFactory(this._video_id, index);
      video.validate();
      return video;
    });
    return this.countObjs === 1 ? (videos[0] as any) : videos;
  }

  get video_id() {
    return this.getValue('video_id');
  }

  get title() {
    return this.getValue('title');
  }

  get description() {
    return this.getValue('description');
  }

  get year_launched() {
    return this.getValue('year_launched');
  }

  get duration() {
    return this.getValue('duration');
  }

  get rating() {
    return this.getValue('rating');
  }

  get is_opened() {
    return this.getValue('is_opened');
  }

  get banner() {
    const banner = this.getValue('banner');
    return (
      banner ??
      new Banner({
        name: 'test-name-banner.png',
        location: 'test path banner',
      })
    );
  }

  get thumbnail() {
    const thumbnail = this.getValue('thumbnail');
    return (
      thumbnail ??
      new Thumbnail({
        name: 'test-name-thumbnail.png',
        location: 'test path thumbnail',
      })
    );
  }

  get thumbnail_half() {
    const thumbnailHalf = this.getValue('thumbnail_half');
    return (
      thumbnailHalf ??
      new ThumbnailHalf({
        name: 'test-name-thumbnail-half.png',
        location: 'test path thumbnail half',
      })
    );
  }

  get trailer() {
    const trailer = this.getValue('trailer');
    return (
      trailer ??
      Trailer.create({
        name: 'test-name-trailer.mp4',
        raw_location: 'test path trailer',
      })
    );
  }

  get video() {
    const video = this.getValue('video');
    return (
      video ??
      Trailer.create({
        name: 'test-name-video.mp4',
        raw_location: 'test path video',
      })
    );
  }

  get categories_id(): CategoryId[] {
    let categories_id = this.getValue('categories_id');

    if (!categories_id.length) {
      categories_id = [new CategoryId()];
    }
    return categories_id;
  }

  get genres_id(): GenreId[] {
    let genres_id = this.getValue('genres_id');

    if (!genres_id.length) {
      genres_id = [new GenreId()];
    }
    return genres_id;
  }

  get cast_members_id(): CastMemberId[] {
    let cast_members_id = this.getValue('cast_members_id');

    if (!cast_members_id.length) {
      cast_members_id = [new CastMemberId()];
    }

    return cast_members_id;
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['video_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    if (typeof factoryOrValue === 'function') {
      return factoryOrValue(index);
    }

    if (factoryOrValue instanceof Array) {
      return factoryOrValue.map((value) => this.callFactory(value, index));
    }

    return factoryOrValue;
  }
}
