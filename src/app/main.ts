import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { StorageFactory, S3Adapter } from '@infrastructure/storage';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  StorageFactory.addStorageDriver(
    's3',
    new S3Adapter(configService.get('fileSystem.s3')),
  );

  await app
    .listen(configService.get('app.port'), configService.get('app.host'))
    .then(() => {
      console.log(
        `Listening on port: ${configService.get('app.port')}, environment=${configService.get('app.environment')}`,
      );
    });
}
bootstrap();
