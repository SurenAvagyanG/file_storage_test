import { Module } from '@nestjs/common';
import { LoggerMiddleware, StandardLoggerMiddleware } from './middleware';
import { LoggerService, WinstonLoggerService } from './service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LoggerService,
      useFactory: (
        configService: ConfigService,
      ): Console | WinstonLoggerService => {
        return configService.getOrThrow('app.environment') == 'LOCAL'
          ? console
          : new WinstonLoggerService();
      },
      inject: [ConfigService],
    },
    {
      provide: LoggerMiddleware,
      useClass: StandardLoggerMiddleware,
    },
  ],
  exports: [LoggerService, LoggerMiddleware],
})
export class LoggerModule {}
