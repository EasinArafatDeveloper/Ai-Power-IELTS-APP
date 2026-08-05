import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers using Helmet
  app.use(helmet());

  // Enable CORS for frontend requests
  app.enableCors({
    origin: '*', // In production, replace with actual frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set global endpoint prefix (excluding root path /)
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Input validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away non-decorated fields in DTOs
      transform: true, // Automatically transforms payloads to match DTO types
      forbidNonWhitelisted: true,
    }),
  );

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
