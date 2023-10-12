import { Category, CategoryId } from '../category.aggregate';

describe('Category Without Validator Unit Tests', () => {
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
  });
  test('constructor of category', () => {
    let category = new Category({ name: 'Movie' });
    expect(category.category_id).toBeInstanceOf(CategoryId);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    category = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at,
    });
    expect(category.category_id).toBeInstanceOf(CategoryId);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('some description');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(created_at);

    category = new Category({
      name: 'Movie',
      description: 'other description',
    });
    expect(category.category_id).toBeInstanceOf(CategoryId);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('other description');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: 'Movie',
      is_active: true,
    });
    expect(category.category_id).toBeInstanceOf(CategoryId);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    created_at = new Date();
    category = new Category({
      name: 'Movie',
      created_at,
    });
    expect(category.category_id).toBeInstanceOf(CategoryId);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBe(created_at);
  });

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      });
      expect(category.category_id).toBeInstanceOf(CategoryId);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'some description',
      });
      expect(category.category_id).toBeInstanceOf(CategoryId);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('some description');
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });

    test('should create a category with is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(CategoryId);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
      expect(category.notification.hasErrors()).toBe(false);
    });
  });

  describe('category_id field', () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new CategoryId() }];

    test.each(arrange)('should be is %j', (props) => {
      const category = new Category(props as any);
      expect(category.category_id).toBeInstanceOf(CategoryId);
    });
  });

  test('should change name', () => {
    const category = new Category({
      name: 'Movie',
    });
    category.changeName('other name');
    expect(category.name).toBe('other name');
    expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('should change description', () => {
    const category = new Category({
      name: 'Movie',
    });
    category.changeDescription('some description');
    expect(category.description).toBe('some description');
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('should active a category', () => {
    const category = new Category({
      name: 'Filmes',
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
    expect(category.notification.hasErrors()).toBe(false);
  });

  test('should disable a category', () => {
    const category = new Category({
      name: 'Filmes',
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
    expect(category.notification.hasErrors()).toBe(false);
  });
});

describe('Category Validator', () => {
  describe('create command', () => {
    test('should an invalid category with name property', () => {
      const category = Category.create({ name: 't'.repeat(256) });

      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid category using name property', () => {
      const category = Category.create({ name: 'Movie' });
      category.changeName('t'.repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
