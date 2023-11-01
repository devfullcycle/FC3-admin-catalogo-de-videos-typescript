import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CategoryModel } from '../../../../category/infra/db/sequelize/category.model';

export type GenreModelProps = {
  genre_id: string;
  name: string;
  categories_id?: GenreCategoryModel[];
  categories?: CategoryModel[];
  is_active: boolean;
  created_at: Date;
};

@Table({ tableName: 'genres', timestamps: false })
export class GenreModel extends Model<GenreModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare genre_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @HasMany(() => GenreCategoryModel, 'genre_id')
  declare categories_id: GenreCategoryModel[];

  @BelongsToMany(() => CategoryModel, () => GenreCategoryModel)
  declare categories: CategoryModel[];

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE(6) })
  declare created_at: Date;
}

export type GenreCategoryModelProps = {
  genre_id: string;
  category_id: string;
};

@Table({ tableName: 'category_genre', timestamps: false })
export class GenreCategoryModel extends Model<GenreCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.UUID })
  declare genre_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID })
  declare category_id: string;
}
