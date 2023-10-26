import { Genre, GenreId } from '../../../domain/genre.aggregate';
import {
  IGenreRepository,
  GenreFilter,
} from '../../../domain/genre.repository';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';

export class GenreInMemoryRepository
  extends InMemorySearchableRepository<Genre, GenreId, GenreFilter>
  implements IGenreRepository
{
  sortableFields: string[] = ['name', 'created_at'];

  getEntity(): new (...args: any[]) => Genre {
    return Genre;
  }

  protected async applyFilter(
    items: Genre[],
    filter: GenreFilter,
  ): Promise<Genre[]> {
    if (!filter) {
      return items;
    }

    return items.filter((genre) => {
      const containsName =
        filter.name &&
        genre.name.toLowerCase().includes(filter.name.toLowerCase());
      const containsCategoriesId =
        filter.categories_id &&
        filter.categories_id.some((c) => genre.categories_id.has(c.id));
      return filter.name && filter.categories_id
        ? containsName && containsCategoriesId
        : filter.name
        ? containsName
        : containsCategoriesId;
    });
  }

  protected applySort(
    items: Genre[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Genre[] {
    return !sort
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sort_dir);
  }
}
