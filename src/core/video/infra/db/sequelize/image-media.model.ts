import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { VideoModel } from './video.model';

export enum ImageMediaRelatedField {
  BANNER = 'banner',
  THUMBNAIL = 'thumbnail',
  THUMBNAIL_HALF = 'thumbnail_half',
}

export type ImageMediaModelProps = {
  image_media_id: string;
  name: string;
  location: string;
  video_id: string;
  video_related_field: ImageMediaRelatedField;
};

@Table({
  tableName: 'image_medias',
  timestamps: false,
  indexes: [{ fields: ['video_id', 'video_related_field'], unique: true }],
})
export class ImageMediaModel extends Model<ImageMediaModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => new Uuid().id })
  declare image_media_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare location: string;

  @ForeignKey(() => VideoModel)
  @Column({ allowNull: false, type: DataType.UUID })
  declare video_id: string;

  @Column({ allowNull: false, type: DataType.STRING(20) })
  declare video_related_field: ImageMediaRelatedField;
}
