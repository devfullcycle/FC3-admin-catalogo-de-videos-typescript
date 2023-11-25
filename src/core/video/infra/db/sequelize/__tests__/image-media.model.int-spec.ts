import { DataType } from 'sequelize-typescript';
import { ImageMediaModel } from '../image-media.model';
import { setupSequelizeForVideo } from '../testing/helpers';

describe('ImageMediaModel Unit Tests', () => {
  setupSequelizeForVideo();

  test('table name', () => {
    expect(ImageMediaModel.tableName).toBe('image_medias');
  });

  test('mapping props', () => {
    const uniqueIndex = ImageMediaModel.options.indexes![0];
    expect(uniqueIndex).toMatchObject({
      fields: ['video_id', 'video_related_field'],
      unique: true,
    });

    const attributesMap = ImageMediaModel.getAttributes();
    const attributes = Object.keys(ImageMediaModel.getAttributes());
    expect(attributes).toStrictEqual([
      'image_media_id',
      'name',
      'location',
      'video_id',
      'video_related_field',
    ]);

    const imageMediaIdAttr = attributesMap.image_media_id;
    expect(imageMediaIdAttr).toMatchObject({
      field: 'image_media_id',
      fieldName: 'image_media_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const locationAttr = attributesMap.location;
    expect(locationAttr).toMatchObject({
      field: 'location',
      fieldName: 'location',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const videoIdAttr = attributesMap.video_id;
    expect(videoIdAttr).toMatchObject({
      field: 'video_id',
      fieldName: 'video_id',
      allowNull: false,
      type: DataType.UUID(),
      references: {
        model: 'videos',
        key: 'video_id',
      },
    });

    const videoRelatedFieldAttr = attributesMap.video_related_field;
    expect(videoRelatedFieldAttr).toMatchObject({
      field: 'video_related_field',
      fieldName: 'video_related_field',
      allowNull: false,
      type: DataType.STRING(20),
    });
  });
});
