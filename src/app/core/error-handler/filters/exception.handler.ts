import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { isProdMode } from '@shared/utils';

const EXCEPTION_MESSAGE = 'Sorry, something went wrong';
@Catch()
export class ExceptionHandler implements ExceptionFilter {
  private logger = new Logger();
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    } else {
      this.logger.warn(exception);
    }

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
