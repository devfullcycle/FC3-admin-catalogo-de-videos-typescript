import { SortDirection } from '@core/shared/domain/repository/search-params';
import { GenresController } from '../genres.controller';
import { GenreCollectionPresenter, GenrePresenter } from '../genres.presenter';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { CreateGenreOutput } from '../../../core/genre/application/use-cases/create-genre/create-genre.use-case';
import { UpdateGenreOutput } from '../../../core/genre/application/use-cases/update-genre/update-genre.use-case';
import { GetGenreOutput } from '../../../core/genre/application/use-cases/get-genre/get-genre.use-case';
import { ListGenresOutput } from '../../../core/genre/application/use-cases/list-genres/list-genres.use-case';

describe('GenresController Unit Tests', () => {
  let controller: GenresController;

  beforeEach(async () => {
    controller = new GenresController();
  });

  it('should creates a genre', async () => {
    const output: CreateGenreOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'action',
      categories: [
        {
          id: '8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a',
          name: 'category',
          created_at: new Date(),
        },
      ],
      is_active: true,
      categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateGenreDto = {
      name: 'action',
      categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
    };
    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should updates a genre', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateGenreOutput = {
      id,
      name: 'action',
      categories: [
        {
          id: '8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a',
          name: 'category',
          created_at: new Date(),
        },
      ],
      is_active: true,
      categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateGenreDto = {
      name: 'action',
      categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetGenreOutput = {
      id,
      name: 'action',
      categories: [
        {
          id: '8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a',
          name: 'category',
          created_at: new Date(),
        },
      ],
      is_active: true,
      categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should list categories', async () => {
    const output: ListGenresOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'action',
          categories: [
            {
              id: '8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a',
              name: 'category',
              created_at: new Date(),
            },
          ],
          is_active: true,
          categories_id: ['8d0b0c9e-9b1a-4e8a-9e1a-3b2c1d7c6b5a'],
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: { name: 'actor test' },
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(GenreCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new GenreCollectionPresenter(output));
  });
});
