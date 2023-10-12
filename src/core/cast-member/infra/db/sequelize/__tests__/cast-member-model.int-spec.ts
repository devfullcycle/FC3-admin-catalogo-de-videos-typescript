import { DataType } from 'sequelize-typescript';
import * as CastMemberSequelize from '../cast-member-sequelize';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberTypes } from '../../../../domain/cast-member-type.vo';

const { CastMemberModel } = CastMemberSequelize;

describe('CastMemberModel Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  test('mapping props', () => {
    const attributesMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(CastMemberModel.getAttributes());
    expect(attributes).toStrictEqual([
      'cast_member_id',
      'name',
      'type',
      'created_at',
    ]);

    const castMemberIdAttr = attributesMap.cast_member_id;
    expect(castMemberIdAttr).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const typeAttr = attributesMap.type;
    expect(typeAttr).toMatchObject({
      field: 'type',
      fieldName: 'type',
      allowNull: false,
      type: DataType.SMALLINT(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    const arrange = {
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      type: CastMemberTypes.ACTOR,
      created_at: new Date(),
    };
    const castMember = await CastMemberModel.create(arrange);
    expect(castMember.toJSON()).toStrictEqual(arrange);
  });
});
