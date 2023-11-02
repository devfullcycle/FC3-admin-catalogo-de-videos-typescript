import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../domain/genre.aggregate';

export type GenreCategoryOutput = {
  id: string;
  name: string;
  created_at: Date;
};

export type GenreOutput = {
  id: string;
  name: string;
  categories: GenreCategoryOutput[];
  categories_id: string[];
  is_active: boolean;
  created_at: Date;
};

export class GenreOutputMapper {
  static toOutput(entity: Genre, categories: Category[]): GenreOutput {
    return {
      id: entity.genre_id.id,
      name: entity.name,
      categories: categories.map((c) => ({
        id: c.category_id.id,
        name: c.name,
        created_at: c.created_at,
      })),
      categories_id: categories.map((c) => c.category_id.id),
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
