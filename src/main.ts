import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v3');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  setupSwagger(app);
  await app.listen(3001);
}
bootstrap();
