import { Global, Module } from '@nestjs/common';
import { DefaultDatabaseModule } from './default/default-database.module';
// import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    DefaultDatabaseModule,
    // RedisModule
  ],
  exports: [
    DefaultDatabaseModule,
    // RedisModule
  ],
})
export class DatabasesModule {}
