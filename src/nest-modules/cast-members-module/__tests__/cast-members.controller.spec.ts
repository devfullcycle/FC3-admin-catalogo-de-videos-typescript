import { SortDirection } from '@core/shared/domain/repository/search-params';
import { CastMembersController } from '../cast-members.controller';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import { UpdateCastMemberDto } from '../dto/update-cast-member.dto';
import { CastMemberTypes } from '../../../core/cast-member/domain/cast-member-type.vo';
import { CreateCastMemberOutput } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberOutput } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { GetCastMemberOutput } from '../../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { ListCastMembersOutput } from '../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';

describe('CastMembersController Unit Tests', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should creates a cast member', async () => {
    const output: CreateCastMemberOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Member',
      type: CastMemberTypes.ACTOR,
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCastMemberDto = {
      name: 'Member',
      type: CastMemberTypes.ACTOR,
    };
    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
    //expect(expectedOutput).toStrictEqual(output);
  });

  it('should updates a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCastMemberOutput = {
      id,
      name: 'Member',
      type: CastMemberTypes.ACTOR,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCastMemberDto = {
      name: 'Member',
      type: CastMemberTypes.ACTOR,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should deletes a cast member', async () => {
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

  it('should gets a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCastMemberOutput = {
      id,
      name: 'Member',
      type: CastMemberTypes.ACTOR,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should list cast members', async () => {
    const output: ListCastMembersOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Member',
          type: CastMemberTypes.ACTOR,
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
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CastMemberCollectionPresenter(output));
  });
});

//repository in memory
//casos de uso - mock
