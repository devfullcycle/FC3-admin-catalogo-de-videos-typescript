import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../domain/genre.aggregate';
import { GenreOutputMapper } from './genre-output';

describe('GenreOutputMapper Unit Tests', () => {
  it('should convert a genre in output', () => {
    const categories = Category.fake().theCategories(2).build();
    const created_at = new Date();
    const entity = Genre.fake()
      .aGenre()
      .withName('test')
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .withCreatedAt(created_at)
      .build();
    const output = GenreOutputMapper.toOutput(entity, categories);
    expect(output).toStrictEqual({
      id: entity.genre_id.id,
      name: 'test',
      categories: [
        {
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        },
        {
          id: categories[1].category_id.id,
          name: categories[1].name,
          created_at: categories[1].created_at,
        },
      ],
      categories_id: [
        categories[0].category_id.id,
        categories[1].category_id.id,
      ],
      is_active: entity.is_active,
      created_at,
    });
  });
});
