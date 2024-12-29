import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'express';
import * as bodyParser from 'body-parser';
import { env } from './infra/core/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Back End Test API')
    .setDescription('API for back end test to Teddy Open Finance')
    .setVersion('1.0')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  app.use(urlencoded({ extended: true }));

  await app.startAllMicroservices();

  await app.listen(env.port ?? 3000);

  Logger.log(
    `Swagger UI disponível em: http://localhost:${env.port}/swagger#/`,
  );
}

bootstrap();
