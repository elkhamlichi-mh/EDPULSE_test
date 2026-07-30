import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Préfixe global : toutes les routes sous /api (ex : GET /api/products).
  app.setGlobalPrefix('api');

  // CORS ouvert (configurable via CORS_ORIGIN) pour laisser le frontend appeler l'API.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? true,
  });

  // Validation + transformation automatique des DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // rejette les query params inconnus
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // Format d'erreur uniforme.
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 API prête sur http://localhost:${port}/api/products`, 'Bootstrap');
}

void bootstrap();
