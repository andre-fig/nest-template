import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { createTypeOrmOptions } from '../factories/typeorm-config.factory';
import { DatabaseEnum } from 'src/shared/enums/database.enum';
import { entityMap } from '../entity.map';

const database = DatabaseEnum.DEFAULT;
const entities = entityMap[database];

loadEnv();

const configService = new ConfigService();

const dataSourceOptions = createTypeOrmOptions(
  configService,
  database,
  entities,
);

export default new DataSource(dataSourceOptions);
