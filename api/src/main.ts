import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001'],
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips unknown fields
      forbidNonWhitelisted: true, // error if unknown fields are sent
      transform: true,            // auto-transform payloads to DTO classes
    }),
  );

  await app.listen(4000);
}

bootstrap();

