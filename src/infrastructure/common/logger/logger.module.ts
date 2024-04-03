import { Module } from '@nestjs/common';
import { LoggerService, WinstonLoggerService } from './service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphqlLoggingInterceptor } from './interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
      provide: APP_INTERCEPTOR,
      useClass: GraphqlLoggingInterceptor,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
