import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('cast_member_video', {
    video_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    cast_member_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
  await sequelize.getQueryInterface().addConstraint('cast_member_video', {
    fields: ['video_id'],
    type: 'foreign key',
    name: 'cast_member_video_video_id',
    references: {
      table: 'videos',
      field: 'video_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
  await sequelize.getQueryInterface().addConstraint('cast_member_video', {
    fields: ['cast_member_id'],
    type: 'foreign key',
    name: 'cast_member_video_cast_member_id',
    references: {
      table: 'cast_members',
      field: 'cast_member_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('cast_member_video', 'cast_member_video_video_id');
  await sequelize
    .getQueryInterface()
    .removeConstraint('cast_member_video', 'cast_member_video_cast_member_id');
  await sequelize.getQueryInterface().dropTable('cast_member_video');
};
