import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../pagination.presenter';

describe('PaginationPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.current_page).toBe(1);
      expect(presenter.per_page).toBe(2);
      expect(presenter.last_page).toBe(3);
      expect(presenter.total).toBe(4);
    });

    it('should set string number values', () => {
      const presenter = new PaginationPresenter({
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });

      expect(presenter.current_page).toBe('1');
      expect(presenter.per_page).toBe('2');
      expect(presenter.last_page).toBe('3');
      expect(presenter.total).toBe('4');
    });
  });

  it('should presenter data', () => {
    let presenter = new PaginationPresenter({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    presenter = new PaginationPresenter({
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });
  });
});
