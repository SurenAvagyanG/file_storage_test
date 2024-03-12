import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  await app
    .listen(configService.get('app.port'), configService.get('app.host'))
    .then(() => {
      console.log(
        `Listening on port: ${configService.get('app.port')}, environment=${configService.get('app.environment')}`,
      );
    });
}
bootstrap();
