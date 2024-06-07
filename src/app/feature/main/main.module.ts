import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { MainResolver } from '@feature/main/main.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
    }),
  ],
  controllers: [MainController],
  providers: [MainService, MainResolver],
})
export class MainModule {}
