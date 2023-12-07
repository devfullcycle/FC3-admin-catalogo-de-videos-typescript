import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('genre_video', {
    video_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
  await sequelize.getQueryInterface().addConstraint('genre_video', {
    fields: ['video_id'],
    type: 'foreign key',
    name: 'genre_video_video_id',
    references: {
      table: 'videos',
      field: 'video_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
  await sequelize.getQueryInterface().addConstraint('genre_video', {
    fields: ['genre_id'],
    type: 'foreign key',
    name: 'genre_video_genre_id',
    references: {
      table: 'genres',
      field: 'genre_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('genre_video', 'genre_video_video_id');
  await sequelize
    .getQueryInterface()
    .removeConstraint('genre_video', 'genre_video_genre_id');
  await sequelize.getQueryInterface().dropTable('genre_video');
};
