import { CategoryId } from '../../../category/domain/category.aggregate';
import { Genre, GenreId } from '../genre.aggregate';

describe('Genre Unit Tests', () => {
  beforeEach(() => {
    Genre.prototype.validate = jest
      .fn()
      .mockImplementation(Genre.prototype.validate);
  });
  test('constructor of genre', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map([[categoryId.id, categoryId]]);
    let genre = new Genre({
      name: 'test',
      categories_id: categoriesId,
    });
    expect(genre.genre_id).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categories_id).toEqual(categoriesId);
    expect(genre.is_active).toBe(true);
    expect(genre.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    genre = new Genre({
      name: 'test',
      categories_id: categoriesId,
      is_active: false,
      created_at,
    });
    expect(genre.genre_id).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categories_id).toEqual(categoriesId);
    expect(genre.is_active).toBe(false);
    expect(genre.created_at).toBe(created_at);
  });

  describe('genre_id field', () => {
    const categoryId = new CategoryId();
    const categories_id = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const arrange = [
      { name: 'Movie', categories_id },
      { name: 'Movie', categories_id, id: null },
      { name: 'Movie', categories_id, id: undefined },
      { name: 'Movie', categories_id, id: new GenreId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const genre = new Genre(item);
      expect(genre.genre_id).toBeInstanceOf(GenreId);
    });
  });

  describe('create command', () => {
    test('should create a genre', () => {
      const categoryId = new CategoryId();
      const categories_id = new Map([[categoryId.id, categoryId]]);
      const genre = Genre.create({
        name: 'test',
        categories_id: [categoryId],
      });
      expect(genre.genre_id).toBeInstanceOf(GenreId);
      expect(genre.name).toBe('test');
      expect(genre.categories_id).toEqual(categories_id);
      expect(genre.created_at).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

      const genre2 = Genre.create({
        name: 'test',
        categories_id: [categoryId],
        is_active: false,
      });
      expect(genre2.genre_id).toBeInstanceOf(GenreId);
      expect(genre2.name).toBe('test');
      expect(genre2.categories_id).toEqual(categories_id);
      expect(genre2.is_active).toBe(false);
      expect(genre2.created_at).toBeInstanceOf(Date);
    });
  });

  test('should change name', () => {
    const genre = Genre.create({
      name: 'test',
      categories_id: [new CategoryId()],
    });
    genre.changeName('test2');
    expect(genre.name).toBe('test2');
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should add category id', () => {
    const categoryId = new CategoryId();
    const genre = Genre.create({
      name: 'test',
      categories_id: [categoryId],
    });
    genre.addCategoryId(categoryId);
    expect(genre.categories_id.size).toBe(1);
    expect(genre.categories_id).toEqual(new Map([[categoryId.id, categoryId]]));
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

    const categoryId2 = new CategoryId();
    genre.addCategoryId(categoryId2);
    expect(genre.categories_id.size).toBe(2);
    expect(genre.categories_id).toEqual(
      new Map([
        [categoryId.id, categoryId],
        [categoryId2.id, categoryId2],
      ]),
    );
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
  });
});

describe('Genre Validator', () => {
  describe('create command', () => {
    test('should an invalid genre with name property', () => {
      const categoryId = new CategoryId();
      const genre = Genre.create({
        name: 't'.repeat(256),
        categories_id: [categoryId],
      } as any);
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
  describe('changeName method', () => {
    it('should a invalid genre using name property', () => {
      const genre = Genre.fake().aGenre().build();
      genre.changeName('t'.repeat(256));
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
