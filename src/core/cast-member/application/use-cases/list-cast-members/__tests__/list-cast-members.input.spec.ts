import { validateSync } from 'class-validator';
import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';
import {
  ListCastMembersFilter,
  ListCastMembersInput,
} from '../list-cast-members.input';

describe('ListCastMembersInput Unit Tests', () => {
  test('validate', () => {
    const input = new ListCastMembersInput();
    input.page = 1;
    input.per_page = 10;
    input.sort = 'name';
    input.sort_dir = 'asc';
    const filter = new ListCastMembersFilter();
    filter.name = 'name';
    filter.type = CastMemberTypes.ACTOR;
    input.filter = filter;

    const errors = validateSync(input);
    expect(errors.length).toBe(0);
  });

  test('invalidate', () => {
    const input = new ListCastMembersInput();
    input.page = 1;
    input.per_page = 10;
    input.sort = 'name';
    input.sort_dir = 'asc';
    const filter = new ListCastMembersFilter();
    filter.name = 'name';
    filter.type = 'a' as any;
    input.filter = filter;

    const errors = validateSync(input);
    expect(errors.length).toBe(1);
  });
});
