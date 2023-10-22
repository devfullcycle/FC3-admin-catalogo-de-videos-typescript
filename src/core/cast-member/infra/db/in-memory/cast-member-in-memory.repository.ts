import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import {
  ICastMemberRepository,
  CastMemberFilter,
} from '../../../domain/cast-member.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter
  >
  implements ICastMemberRepository
{
  sortableFields: string[] = ['name', 'created_at'];

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      const containsName =
        filter.name && i.name.toLowerCase().includes(filter.name.toLowerCase());
      const hasType = filter.type && i.type.equals(filter.type);
      return filter.name && filter.type
        ? containsName && hasType
        : filter.name
        ? containsName
        : hasType;
    });
  }

  protected applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): CastMember[] {
    return !sort
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sort_dir);
  }
}
