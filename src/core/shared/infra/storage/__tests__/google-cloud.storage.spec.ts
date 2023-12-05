import { Config } from '../../config';
import { GoogleCloudStorage } from '../google-cloud.storage';
import { Storage as GoogleCloudStorageSdk } from '@google-cloud/storage';
describe('GoogleCloudStorage Unit Tests', () => {
  let googleCloudStorage: GoogleCloudStorage;
  let storageSdk: GoogleCloudStorageSdk;

  beforeEach(() => {
    storageSdk = new GoogleCloudStorageSdk({
      credentials: Config.googleCredentials(),
    });
    const bucketName = Config.bucketName();
    googleCloudStorage = new GoogleCloudStorage(storageSdk, bucketName);
  });

  it('should store a file', async () => {
    const saveMock = jest.fn().mockImplementation(undefined);
    const fileMock = jest.fn().mockImplementation(() => ({
      save: saveMock,
    }));
    jest.spyOn(storageSdk, 'bucket').mockImplementation(
      () =>
        ({
          file: fileMock,
        }) as any,
    );
    await googleCloudStorage.store({
      data: Buffer.from('data'),
      id: 'location/1.txt',
      mime_type: 'text/plain',
    });

    expect(storageSdk.bucket).toBeCalledWith(Config.bucketName());
    expect(fileMock).toBeCalledWith('location/1.txt');
    expect(saveMock).toBeCalledWith(Buffer.from('data'), {
      metadata: {
        contentType: 'text/plain',
      },
    });
  });

  it('should get a file', async () => {
    const getMetadataMock = jest.fn().mockResolvedValue(
      Promise.resolve([
        {
          contentType: 'text/plain',
          name: 'location/1.txt',
        },
      ]),
    );
    const downloadMock = jest
      .fn()
      .mockResolvedValue(Promise.resolve([Buffer.from('data')]));
    const fileMock = jest.fn().mockImplementation(() => ({
      getMetadata: getMetadataMock,
      download: downloadMock,
    }));
    jest.spyOn(storageSdk, 'bucket').mockImplementation(
      () =>
        ({
          file: fileMock,
        }) as any,
    );

    const result = await googleCloudStorage.get('location/1.txt');
    expect(storageSdk.bucket).toBeCalledWith(Config.bucketName());
    expect(fileMock).toBeCalledWith('location/1.txt');
    expect(getMetadataMock).toBeCalled();
    expect(downloadMock).toBeCalled();
    expect(result).toEqual({
      data: Buffer.from('data'),
      mime_type: 'text/plain',
    });
  });
});
