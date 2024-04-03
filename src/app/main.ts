import 'dotenv/config';

// @TODO find nice way to import tracer
import '@infrastructure/common/logger/tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { StorageFactory, S3Adapter } from '@infrastructure/storage';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@infrastructure/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix(configService.getOrThrow('app.service_name'));
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(LoggerService));
  StorageFactory.addStorageDriver(
    's3',
    new S3Adapter(configService.getOrThrow('fileSystem.s3')),
  );

  await app
    .listen(
      configService.getOrThrow('app.port'),
      configService.getOrThrow('app.host'),
    )
    .then(() => {
      Logger.log(
        `Listening on port: ${configService.get('app.port')}, environment=${configService.get('app.environment')}`,
      );
    });
}
bootstrap();
