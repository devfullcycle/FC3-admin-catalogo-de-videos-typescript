import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './nest-modules/global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? console : undefined,
  });

  applyGlobalConfig(app);

  await app.listen(3000);
}
bootstrap();
