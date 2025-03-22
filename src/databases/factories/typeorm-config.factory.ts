import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
  databaseName: string,
  entities: any[],
): DataSourceOptions => {
  const upperDatabaseName = databaseName.toUpperCase();

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
    synchronize: false,
    ssl:
      configService.get<string>(`DB_${upperDatabaseName}_SSL`) === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    logging: true,
  };
};
