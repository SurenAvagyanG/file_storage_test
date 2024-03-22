import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from './filters/exception.handler';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export class ErrorHandlerModule {}
