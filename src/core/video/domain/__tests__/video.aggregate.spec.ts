import { CastMemberId } from '../../../cast-member/domain/cast-member.aggregate';
import { CategoryId } from '../../../category/domain/category.aggregate';
import { GenreId } from '../../../genre/domain/genre.aggregate';
import { Banner } from '../banner.vo';
import { Rating } from '../rating.vo';
import { ThumbnailHalf } from '../thumbnail-half.vo';
import { Thumbnail } from '../thumbnail.vo';
import { Trailer } from '../trailer.vo';
import { VideoMedia } from '../video-media.vo';
import { Video, VideoId } from '../video.aggregate';

describe('Video Unit Tests', () => {
  beforeEach(() => {
    Video.prototype.validate = jest
      .fn()
      .mockImplementation(Video.prototype.validate);
  });
  test('constructor of video', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const genreId = new GenreId();
    const genresId = new Map<string, GenreId>([[genreId.id, genreId]]);
    const castMemberId = new CastMemberId();
    const castMembersId = new Map<string, CastMemberId>([
      [castMemberId.id, castMemberId],
    ]);
    const rating = Rating.createRL();
    let video = new Video({
      title: 'test title',
      description: 'test description',
      year_launched: 2020,
      duration: 90,
      rating,
      is_opened: true,
      is_published: true,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    });
    expect(video).toBeInstanceOf(Video);
    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(video.title).toBe('test title');
    expect(video.description).toBe('test description');
    expect(video.year_launched).toBe(2020);
    expect(video.duration).toBe(90);
    expect(video.rating).toBeInstanceOf(Rating);
    expect(video.is_opened).toBe(true);
    expect(video.is_published).toBe(true);
    expect(video.banner).toBeNull();
    expect(video.thumbnail).toBeNull();
    expect(video.thumbnail_half).toBeNull();
    expect(video.trailer).toBeNull();
    expect(video.video).toBeNull();
    expect(video.categories_id).toEqual(categoriesId);
    expect(video.genres_id).toEqual(genresId);
    expect(video.cast_members_id).toEqual(castMembersId);
    expect(video.created_at).toBeInstanceOf(Date);

    const banner = new Banner({
      name: 'test name banner',
      location: 'test location banner',
    });

    const thumbnail = new Thumbnail({
      name: 'test name thumbnail',
      location: 'test location thumbnail',
    });

    const thumbnailHalf = new ThumbnailHalf({
      name: 'test name thumbnail half',
      location: 'test location thumbnail half',
    });

    const trailer = Trailer.create({
      name: 'test name trailer',
      raw_location: 'test raw location trailer',
    });

    const videoMedia = VideoMedia.create({
      name: 'test name video',
      raw_location: 'test raw location video',
    });

    video = new Video({
      title: 'test title',
      description: 'test description',
      year_launched: 2020,
      duration: 90,
      rating,
      is_opened: true,
      is_published: true,
      banner,
      thumbnail,
      thumbnail_half: thumbnailHalf,
      trailer,
      video: videoMedia,
      categories_id: categoriesId,
      genres_id: genresId,
      cast_members_id: castMembersId,
    });

    expect(video).toBeInstanceOf(Video);
    expect(video.video_id).toBeInstanceOf(VideoId);
    expect(video.title).toBe('test title');
    expect(video.description).toBe('test description');
    expect(video.year_launched).toBe(2020);
    expect(video.duration).toBe(90);
    expect(video.rating).toBeInstanceOf(Rating);
    expect(video.is_opened).toBe(true);
    expect(video.is_published).toBe(true);
    expect(video.banner).toEqual(banner);
    expect(video.thumbnail).toEqual(thumbnail);
    expect(video.thumbnail_half).toEqual(thumbnailHalf);
    expect(video.trailer).toEqual(trailer);
    expect(video.video).toEqual(videoMedia);
    expect(video.categories_id).toEqual(categoriesId);
    expect(video.genres_id).toEqual(genresId);
    expect(video.cast_members_id).toEqual(castMembersId);
    expect(video.created_at).toBeInstanceOf(Date);
  });

  describe('video_id field', () => {
    const arrange = [
      {},
      { id: null },
      { id: undefined },
      { id: new VideoId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const genre = new Video(item as any);
      expect(genre.video_id).toBeInstanceOf(VideoId);
    });
  });

  describe('create command', () => {
    test('should create a video and no publish video media', () => {
      const categories_id = [new CategoryId()];
      const genres_id = [new GenreId()];
      const cast_members_id = [new CastMemberId()];

      const spyOnVideCreated = jest.spyOn(Video.prototype, 'onVideoCreated');
      const tryMarkAsPublished = jest.spyOn(
        Video.prototype as any,
        'tryMarkAsPublished',
      );
      const video = Video.create({
        title: 'test title',
        description: 'test description',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id,
        genres_id,
        cast_members_id,
      });
      expect(video.video_id).toBeInstanceOf(VideoId);
      expect(video.title).toBe('test title');
      expect(video.description).toBe('test description');
      expect(video.year_launched).toBe(2020);
      expect(video.duration).toBe(90);
      expect(video.rating).toBeInstanceOf(Rating);
      expect(video.is_opened).toBe(true);
      expect(video.is_published).toBe(false);
      expect(video.banner).toBeNull();
      expect(video.thumbnail).toBeNull();
      expect(video.thumbnail_half).toBeNull();
      expect(video.trailer).toBeNull();
      expect(video.video).toBeNull();
      expect(video.categories_id).toEqual(
        new Map(categories_id.map((id) => [id.id, id])),
      );
      expect(video.genres_id).toEqual(
        new Map(genres_id.map((id) => [id.id, id])),
      );
      expect(video.cast_members_id).toEqual(
        new Map(cast_members_id.map((id) => [id.id, id])),
      );
      expect(video.created_at).toBeInstanceOf(Date);
      expect(video.is_published).toBeFalsy();
      expect(spyOnVideCreated).toHaveBeenCalledTimes(1);
      expect(tryMarkAsPublished).toHaveBeenCalledTimes(1);
    });

    test('should create a video and published video', () => {
      const categories_id = [new CategoryId()];
      const genres_id = [new GenreId()];
      const cast_members_id = [new CastMemberId()];

      const spyOnVideCreated = jest.spyOn(Video.prototype, 'onVideoCreated');
      const tryMarkAsPublished = jest.spyOn(
        Video.prototype as any,
        'tryMarkAsPublished',
      );

      const trailer = Trailer.create({
        name: 'test name trailer',
        raw_location: 'test raw location trailer',
      }).complete('test encoded_location trailer');
      const videoMedia = VideoMedia.create({
        name: 'test name video',
        raw_location: 'test raw location video',
      }).complete('test encoded_location video');

      const video = Video.create({
        title: 'test title',
        description: 'test description',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        trailer,
        video: videoMedia,
        categories_id,
        genres_id,
        cast_members_id,
      });
      expect(video.video_id).toBeInstanceOf(VideoId);
      expect(video.title).toBe('test title');
      expect(video.description).toBe('test description');
      expect(video.year_launched).toBe(2020);
      expect(video.duration).toBe(90);
      expect(video.rating).toBeInstanceOf(Rating);
      expect(video.is_opened).toBe(true);
      expect(video.is_published).toBe(true);
      expect(video.banner).toBeNull();
      expect(video.thumbnail).toBeNull();
      expect(video.thumbnail_half).toBeNull();
      expect(video.trailer).toEqual(trailer);
      expect(video.video).toEqual(videoMedia);
      expect(video.categories_id).toEqual(
        new Map(categories_id.map((id) => [id.id, id])),
      );
      expect(video.genres_id).toEqual(
        new Map(genres_id.map((id) => [id.id, id])),
      );
      expect(video.cast_members_id).toEqual(
        new Map(cast_members_id.map((id) => [id.id, id])),
      );
      expect(video.created_at).toBeInstanceOf(Date);
      expect(video.is_published).toBeTruthy();
      expect(spyOnVideCreated).toHaveBeenCalledTimes(1);
      expect(tryMarkAsPublished).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeTitle method', () => {
    test('should change title', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.changeTitle('test title');
      expect(video.title).toBe('test title');
      expect(Video.prototype.validate).toHaveBeenCalledTimes(3);
    });
  });

  describe('changeDescription method', () => {
    test('should change description', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.changeDescription('test description');
      expect(video.description).toBe('test description');
    });
  });

  describe('changeYearLaunched method', () => {
    test('should change year launched', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.changeYearLaunched(2020);
      expect(video.year_launched).toBe(2020);
    });
  });

  describe('changeDuration method', () => {
    test('should change duration', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.changeDuration(90);
      expect(video.duration).toBe(90);
    });
  });

  describe('changeRating method', () => {
    test('should change rating', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const rating = Rating.createRL();
      video.changeRating(rating);
      expect(video.rating).toBe(rating);
    });
  });

  describe('markAsOpened method', () => {
    test('should mark as opened', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.markAsOpened();
      expect(video.is_opened).toBeTruthy();
    });
  });

  describe('markAsNotOpened method', () => {
    test('should mark as not opened', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.markAsNotOpened();
      expect(video.is_opened).toBeFalsy();
    });
  });

  describe('replaceBanner method', () => {
    test('should replace banner', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const banner = new Banner({
        name: 'test name banner',
        location: 'test location banner',
      });
      video.replaceBanner(banner);
      expect(video.banner).toEqual(banner);
    });
  });

  describe('replaceThumbnail method', () => {
    test('should replace thumbnail', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const thumbnail = new Thumbnail({
        name: 'test name thumbnail',
        location: 'test location thumbnail',
      });
      video.replaceThumbnail(thumbnail);
      expect(video.thumbnail).toEqual(thumbnail);
    });
  });

  describe('replaceThumbnailHalf method', () => {
    test('should replace thumbnail half', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const thumbnailHalf = new ThumbnailHalf({
        name: 'test name thumbnail half',
        location: 'test location thumbnail half',
      });
      video.replaceThumbnailHalf(thumbnailHalf);
      expect(video.thumbnail_half).toEqual(thumbnailHalf);
    });
  });

  describe('replaceTrailer method', () => {
    test('should replace trailer', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const trailer = Trailer.create({
        name: 'test name trailer',
        raw_location: 'test raw location trailer',
      });
      video.replaceTrailer(trailer);
      expect(video.trailer).toEqual(trailer);
    });
  });

  describe('replaceVideo method', () => {
    test('should replace video', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      const videoMedia = VideoMedia.create({
        name: 'test name video',
        raw_location: 'test raw location video',
      });
      video.replaceVideo(videoMedia);
      expect(video.video).toEqual(videoMedia);
    });
  });

  test('should add category id', () => {
    const categoryId = new CategoryId();
    const video = Video.fake().aVideoWithoutMedias().build();
    video.addCategoryId(categoryId);
    expect(video.categories_id.size).toBe(2);
    expect(video.categories_id.get(categoryId.id)).toBe(categoryId);
  });

  test('tryMarkAsPublished method', () => {
    let video = Video.fake().aVideoWithoutMedias().build();
    video['tryMarkAsPublished']();
    expect(video.is_published).toBeFalsy();

    video = Video.fake().aVideoWithoutMedias().build();
    const trailer = Trailer.create({
      name: 'test name trailer',
      raw_location: 'test raw location trailer',
    }).complete('test encoded_location trailer');
    const videoMedia = VideoMedia.create({
      name: 'test name video',
      raw_location: 'test raw location video',
    }).complete('test encoded_location video');

    video.replaceTrailer(trailer);
    video.replaceVideo(videoMedia);
    video['tryMarkAsPublished']();
    expect(video.is_published).toBeTruthy();
  });
});

describe('Video Validator', () => {
  describe('create command', () => {
    test('should an invalid video with title property', () => {
      const video = Video.create({
        title: 't'.repeat(256),
        categories_id: [new CategoryId()],
        genres_id: [new GenreId()],
        cast_members_id: [new CastMemberId()],
      } as any);
      expect(video.notification.hasErrors()).toBe(true);
      expect(video.notification).notificationContainsErrorMessages([
        {
          title: ['title must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
  describe('changeTitle method', () => {
    it('should a invalid video using title property', () => {
      const video = Video.fake().aVideoWithoutMedias().build();
      video.changeTitle('t'.repeat(256));
      expect(video.notification.hasErrors()).toBe(true);
      expect(video.notification).notificationContainsErrorMessages([
        {
          title: ['title must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
