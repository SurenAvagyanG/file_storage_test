import 'dotenv/config';

// @TODO find nice way to import tracer
import '@infrastructure/common/logger/tracer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { StorageFactory, S3Adapter } from '@infrastructure/storage';
import { LoggerService } from '@infrastructure/common';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));

  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('app.global_prefix'));
  
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
    });
}
bootstrap();
