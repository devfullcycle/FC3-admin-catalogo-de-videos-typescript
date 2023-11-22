import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
  MediaFileValidator,
} from '../media-file.validator';

describe('MediaFileValidator Unit Tests', () => {
  const validator = new MediaFileValidator(1024 * 1024, [
    'image/png',
    'image/jpeg',
  ]);

  it('should throw an error if the file size is too large', () => {
    const data = Buffer.alloc(1024 * 1024 + 1);
    expect(() =>
      validator.validate({
        raw_name: 'test.png',
        mime_type: 'image/png',
        size: data.length,
      }),
    ).toThrow(
      new InvalidMediaFileSizeError(data.length, validator['max_size']),
    );
  });

  it('should throw an error if the file mime type is not valid', () => {
    const data = Buffer.alloc(1024);
    expect(() =>
      validator.validate({
        raw_name: 'test.txt',
        mime_type: 'text/plain',
        size: data.length,
      }),
    ).toThrow(
      new InvalidMediaFileMimeTypeError(
        'text/plain',
        validator['valid_mime_types'],
      ),
    );
  });

  it('should return a valid file name', () => {
    const data = Buffer.alloc(1024);
    const { name } = validator.validate({
      raw_name: 'test.png',
      mime_type: 'image/png',
      size: data.length,
    });

    expect(name).toMatch(/\.png$/);
    expect(name).toHaveLength(68);
  });
});
