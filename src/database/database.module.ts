import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '../core/category/infra/db/sequelize/category.model';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite' as any,
      host: ':memory:',
      logging: false,
      models,
    }),
  ],
})
export class DatabaseModule {}
