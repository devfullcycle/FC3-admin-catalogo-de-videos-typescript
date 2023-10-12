import { Module } from '@nestjs/common';
import { CastMembersController } from './cast-members.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CAST_MEMBERS_PROVIDERS } from './cast-members.providers';
@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBERS_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBERS_PROVIDERS.USE_CASES),
  ],
  exports: [CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
})
export class CastMembersModule {}
