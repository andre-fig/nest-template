import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    maxAge: 86400,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`[INIT] Server is running on port ${port}`);
}

void bootstrap();
