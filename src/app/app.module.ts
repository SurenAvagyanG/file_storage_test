import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from './main/main.module';
import { appConfig, dbConfig } from '../config';
import { ErrorHandlerModule } from './error-handler/error-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
    }),
    ErrorHandlerModule,
    MainModule,
  ],
})
export class AppModule {}
