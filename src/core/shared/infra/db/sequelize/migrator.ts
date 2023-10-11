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
