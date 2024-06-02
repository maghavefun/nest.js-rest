import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('BACKEND_PORT');
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(port);

  logger.log(`Backend is runnig on http://localhost:${port}`);
}
bootstrap();
