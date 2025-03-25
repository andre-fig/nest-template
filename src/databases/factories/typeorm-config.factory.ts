import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
  databaseName: string,
  entities: any[],
): DataSourceOptions => {
  const upperDatabaseName = databaseName.toUpperCase();
  const NODE_ENV = configService.get<string>('NODE_ENV', 'development');

  return {
    type: 'postgres',
    name: databaseName,
    host: configService.get<string>(
      `DB_${upperDatabaseName}_HOST`,
      'localhost',
    ),
    port: configService.get<number>(`DB_${upperDatabaseName}_PORT`, 5432),
    username: configService.get<string>(
      `DB_${upperDatabaseName}_USERNAME`,
      'default_user',
    ),
    password: configService.get<string>(
      `DB_${upperDatabaseName}_PASSWORD`,
      'default_password',
    ),
    database: configService.get<string>(
      `DB_${upperDatabaseName}_DATABASE`,
      'default_db',
    ),
    entities,
    migrations: [
      NODE_ENV === 'development'
        ? `src/databases/${databaseName}/migrations/*{.ts}`
        : `dist/databases/${databaseName}/migrations/*{.js}`,
    ],
    migrationsRun: true,
    synchronize: false,
    ssl:
      configService.get<string>(`DB_${upperDatabaseName}_SSL`) === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    logging: true,
  };
};
