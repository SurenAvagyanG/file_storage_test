import 'dotenv/config';

// @TODO find nice way to import tracer
import '@infrastructure/common/logger/tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@infrastructure/common';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));

  const configService: ConfigService = app.get(ConfigService);

  await app
    .listen(configService.get('app.port'), configService.get('app.host'))
    .then(() => {
      Logger.log(
        `Listening on port: ${configService.get('app.port')}, environment=${configService.get('app.environment')}`,
      );
    });
}
bootstrap();
