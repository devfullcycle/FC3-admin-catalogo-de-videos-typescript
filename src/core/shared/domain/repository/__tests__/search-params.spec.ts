import { SearchParams } from '../search-params';

describe('SearchParams Unit Tests', () => {
  test('page prop', () => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },

      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ page: i.page as any }).page).toBe(i.expected);
    });
  });

  test('per_page prop', () => {
    const params = new SearchParams();
    expect(params.per_page).toBe(15);

    //TODO refactor to test.each
    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'fake', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 5.5, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },

      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
      { per_page: 10, expected: 10 },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ per_page: i.per_page as any }).per_page).toBe(
        i.expected,
      );
    });
  });

  test('sort prop', () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    //TODO refactor to test.each
    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'field', expected: 'field' },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ sort: i.sort as any }).sort).toBe(i.expected);
    });
  });

  test('sort_dir prop', () => {
    let params = new SearchParams();
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: '' });
    expect(params.sort_dir).toBeNull();

    //TODO refactor to test.each
    const arrange = [
      { sort_dir: null, expected: 'asc' },
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: 0, expected: 'asc' },
      { sort_dir: 'fake', expected: 'asc' },

      { sort_dir: 'asc', expected: 'asc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'desc', expected: 'desc' },
      { sort_dir: 'DESC', expected: 'desc' },
    ];

    arrange.forEach((i) => {
      expect(
        new SearchParams({ sort: 'field', sort_dir: i.sort_dir as any })
          .sort_dir,
      ).toBe(i.expected);
    });
  });

  test('filter prop', () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    //TODO refactor to test.each
    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },

      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
      { filter: 'field', expected: 'field' },
    ];

    arrange.forEach((i) => {
      expect(new SearchParams({ filter: i.filter as any }).filter).toBe(
        i.expected,
      );
    });
  });
});
