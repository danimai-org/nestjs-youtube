import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = Number(configService.get('app.port'));

  const config = new DocumentBuilder()
    .setTitle(configService.get('app.main') || 'Nest JS Tutorial')
    .setDescription('Basic APIs')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  console.log('Started on port', port);
  await app.listen(port);
}
void bootstrap();
