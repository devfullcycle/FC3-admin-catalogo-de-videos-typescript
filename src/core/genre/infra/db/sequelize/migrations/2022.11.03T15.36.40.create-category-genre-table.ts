import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('category_genre', {
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
  await sequelize.getQueryInterface().addConstraint('category_genre', {
    fields: ['genre_id'],
    type: 'foreign key',
    name: 'category_genre_genre_id',
    references: {
      table: 'genres',
      field: 'genre_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
  await sequelize.getQueryInterface().addConstraint('category_genre', {
    fields: ['category_id'],
    type: 'foreign key',
    name: 'category_genre_category_id',
    references: {
      table: 'categories',
      field: 'category_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('category_genre', 'category_genre_genre_id');
  await sequelize
    .getQueryInterface()
    .removeConstraint('category_genre', 'category_genre_category_id');

  await sequelize.getQueryInterface().dropTable('category_genre');
};
