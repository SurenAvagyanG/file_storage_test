import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { StorageFactory, S3Adapter } from '@infrastructure/storage';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

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
      console.log(
        `Listening on port: ${configService.getOrThrow('app.port')}, environment=${configService.getOrThrow('app.environment')}`,
      );
    });
}
bootstrap();
