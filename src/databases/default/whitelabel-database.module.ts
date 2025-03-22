import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseEnum } from '../../shared/enums/database.enum';
import { ProposalEntity } from './entities/proposal.entity';
import { createTypeOrmOptions } from '../factories/typeorm-config.factory';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService, DatabaseEnum.DEFAULT, [
          ProposalEntity,
        ]),
    }),
    TypeOrmModule.forFeature([ProposalEntity], DatabaseEnum.DEFAULT),
  ],
  providers: [
    {
      provide: getDataSourceToken(DatabaseEnum.DEFAULT),
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const options = createTypeOrmOptions(
          configService,
          DatabaseEnum.DEFAULT,
          [ProposalEntity],
        );

        const dataSource = new DataSource(options);

        await dataSource.initialize();

        return dataSource;
      },
    },
  ],
  exports: [TypeOrmModule, getDataSourceToken(DatabaseEnum.DEFAULT)],
})
export class DefaultDatabaseModule {}
