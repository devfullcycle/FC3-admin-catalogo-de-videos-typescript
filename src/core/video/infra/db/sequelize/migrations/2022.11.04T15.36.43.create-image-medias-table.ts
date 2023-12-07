import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('image_medias', {
    image_media_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    video_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    video_related_field: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });

  await sequelize.getQueryInterface().addConstraint('image_medias', {
    fields: ['video_id'],
    type: 'foreign key',
    name: 'image_medias_video_id',
    references: {
      table: 'videos',
      field: 'video_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('image_medias', 'image_medias_video_id');
  await sequelize.getQueryInterface().dropTable('image_medias');
};
