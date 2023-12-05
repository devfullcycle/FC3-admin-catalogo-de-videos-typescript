import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
} from '../../../shared/domain/validators/media-file.validator';
import { Banner } from '../banner.vo';
import { VideoId } from '../video.aggregate';

describe('Banner Unit Tests', () => {
  it('should create a Banner object from a valid file', () => {
    const data = Buffer.alloc(1024);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: data.length,
      video_id: videoId,
    }).asArray();

    expect(error).toBeNull();
    expect(banner).toBeInstanceOf(Banner);
    expect(banner.name).toMatch(/\.png$/);
    expect(banner.location).toBe(`videos/${videoId.id}/images`);
  });

  it('should throw an error if the file size is too large', () => {
    const data = Buffer.alloc(Banner.max_size + 1);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: data.length,
      video_id: videoId,
    });

    expect(banner).toBeNull();
    expect(error).toBeInstanceOf(InvalidMediaFileSizeError);
  });

  it('should throw an error if the file mime type is not valid', () => {
    const data = Buffer.alloc(1024);
    const videoId = new VideoId();
    const [banner, error] = Banner.createFromFile({
      raw_name: 'test.txt',
      mime_type: 'text/plain',
      size: data.length,
      video_id: videoId,
    });

    expect(banner).toBeNull();
    expect(error).toBeInstanceOf(InvalidMediaFileMimeTypeError);
  });
});
