import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { ProposalsModule } from './proposals/proposals.module';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from './databases/databases.module';

import { BullmqModule } from './bullmq/bullmq.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabasesModule,
    ProposalsModule,
    BullmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
