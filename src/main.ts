import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    maxAge: 86400,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const nodeEnv = configService.get<string>('NODE_ENV');
  if (nodeEnv === 'homolog') {
    const dataSource = app.get(DataSource);
    logger.log('[INIT] Running pending database migrations...');
    await dataSource.runMigrations();
    logger.log('[DONE] Migrations executed successfully');
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`[INIT] Server is running on port ${port}`);
}

void bootstrap();
