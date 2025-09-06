import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { logger } from './common/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages:false
  }))
  app.useGlobalInterceptors(new LoggingInterceptor(logger))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
