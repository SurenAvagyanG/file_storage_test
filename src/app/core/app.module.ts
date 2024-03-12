import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from '../../config/app.config';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from '../../config/db.config';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
    }),
    ErrorHandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
