import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@feature/main/main.module';
import { ErrorHandlerModule } from '@core/error-handler/error-handler.module';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';

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
