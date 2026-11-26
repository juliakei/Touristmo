import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Root Health Check
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Welcome to TOURISTMO API (NestJS Refactored)',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`TOURISTMO NestJS backend running on port ${port}`);
}
bootstrap();
