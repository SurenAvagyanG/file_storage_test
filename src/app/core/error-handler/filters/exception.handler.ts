import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isProdMode } from '@shared/utils';

const EXCEPTION_MESSAGE = 'Sorry, something went wrong';
@Catch()
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      isProdMode()
        ? {
            errorMessage: EXCEPTION_MESSAGE,
          }
        : {
            errorMessage: exception.message,
            stack: exception.stack,
          },
    );
  }
}
