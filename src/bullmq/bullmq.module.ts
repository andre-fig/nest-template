import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueEnum } from '../shared/enums/queue.enum';
import { BullmqService } from './bullmq.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      ...Object.values(QueueEnum).map((queueName) => ({
        name: queueName,
      })),
    ),
  ],
  providers: [BullmqService],
  exports: [BullModule, BullmqService],
})
export class BullmqModule {}
