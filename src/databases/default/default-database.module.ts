import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseEnum } from '../../shared/enums/database.enum';
import { createTypeOrmOptions } from '../factories/typeorm-config.factory';
import { User } from 'src/users/entities/user.entity';

const database = DatabaseEnum.DEFAULT;
const entities = [User];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, database, entities),
    }),
    TypeOrmModule.forFeature(entities, database),
  ],
  providers: [
    {
      provide: getDataSourceToken(database),
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options = createTypeOrmOptions(configService, database, entities);

        const dataSource = new DataSource(options);
        await dataSource.initialize();

        return dataSource;
      },
    },
  ],
  exports: [TypeOrmModule, getDataSourceToken(database)],
})
export class DefaultDatabaseModule {}
