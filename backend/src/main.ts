import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  const CLIENT_URL = configService.get<string>('CLIENT_URL');

  app.use(cookieParser());
  app.enableCors({ origin: CLIENT_URL });

  const config = new DocumentBuilder()
    .setTitle('Dinheirando backend')
    .setDescription('Definição de rotas e esquemas do backend')
    .setVersion('1.0')
    .addTag('dinheirando')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
