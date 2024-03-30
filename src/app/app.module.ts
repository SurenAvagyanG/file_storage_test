import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@feature/main/main.module';
import { ErrorHandlerModule } from '@core/error-handler/error-handler.module';
import { appConfig } from '@config/app.config';
import { dbConfig } from '@config/db.config';
import { LoggerModule, LoggerMiddleware } from '@infrastructure/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
    }),
    ErrorHandlerModule,
    MainModule,
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(LoggerMiddleware)
    private readonly loggerMiddleware: LoggerMiddleware,
  ) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(this.loggerMiddleware.constructor).forRoutes('*');
  }
}
