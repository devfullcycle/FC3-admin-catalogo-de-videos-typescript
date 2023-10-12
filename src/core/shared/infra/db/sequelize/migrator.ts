import { join } from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug, UmzugOptions } from 'umzug';

export function migrator(
  sequelize: Sequelize,
  options?: Partial<UmzugOptions>,
) {
  return new Umzug({
    migrations: {
      glob: [
        '*/infra/db/sequelize/migrations/*.{js,ts}',
        {
          cwd: join(__dirname, '..', '..', '..', '..'),
          ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
    ...(options || {}),
  });
}

//validação do schema (mysql que é banco de produção)
//- criar gerar o schema do banco via models
//- criar gerar o schema do banco via migrations
//- gero um dump do schema1 e schema2
