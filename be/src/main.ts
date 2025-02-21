import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './common/exceptions/http-filter.exception';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.enableCors();
  app.useLogger(app.get(Logger));
  await app.listen(config.get('port') || 3000);
}
bootstrap();
