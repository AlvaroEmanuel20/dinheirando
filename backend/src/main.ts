import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  const CLIENT_URL = configService.get<string>('CLIENT_URL');

  app.use(cookieParser());
  app.enableCors({ origin: CLIENT_URL });

  await app.listen(PORT);
}
bootstrap();
