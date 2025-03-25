import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });
  }

  onModuleInit() {
    this.logger.log('[INIT] Redis dependencies initialized');
  }

  onModuleDestroy() {
    this.logger.warn('[CLEANUP] Closing Redis connection...');
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: any, ttlInSeconds?: number): Promise<'OK'> {
    const serialized = JSON.stringify(value);
    if (ttlInSeconds) {
      return this.client.set(key, serialized, 'EX', ttlInSeconds);
    }
    return this.client.set(key, serialized);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(
        `[ERROR] Failed to parse Redis data for key ${key}`,
        error,
      );
      return null;
    }
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}
