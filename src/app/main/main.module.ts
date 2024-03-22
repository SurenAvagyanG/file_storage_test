import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { appConfig } from '../../config';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from '../../config';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
    }),
    ErrorHandlerModule,
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
