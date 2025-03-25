import { Global, Module } from '@nestjs/common';
import { PostgresDatabaseModule } from './postgres/postgres-database.module';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [PostgresDatabaseModule, RedisModule],
  exports: [PostgresDatabaseModule, RedisModule],
})
export class DatabasesModule {}
