import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = Number(configService.get('app.port'));

  const config = new DocumentBuilder()
    .setTitle(configService.get('app.main') || 'Nest JS Tutorial')
    .setDescription('Basic APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(express.static('uploads'));
  await app.listen(port);
  console.log('Started on port', port);
}
void bootstrap();
