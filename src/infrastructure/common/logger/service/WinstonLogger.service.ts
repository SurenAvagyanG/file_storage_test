import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerService } from './Logger.service';

@Injectable()
export class WinstonLoggerService extends LoggerService {
  private winstonLoggerInfoLevel = this.createSingleLineLogger('info');
  private winstonLoggerFatalLevel = this.createSingleLineLogger('fatal');
  private winstonLoggerErrorLevel = this.createSingleLineLogger('error');
  private winstonLoggerWarnLevel = this.createSingleLineLogger('warn');
  private winstonLoggerDebugLevel = this.createSingleLineLogger('debug');
  private winstonLoggerVerboseLevel = this.createSingleLineLogger('verbose');

  createSingleLineLogger(logLevel: string): winston.Logger {
    return winston.createLogger({
      level: logLevel,
      defaultMeta: {},
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }
  info(message: string, ...optionalParams: string[]): void {
    this.log(message, ...optionalParams);
  }
  log(message: string, ...optionalParams: string[]): void {
    this.winstonLoggerInfoLevel.info(message, optionalParams);
  }
  error(message: string, context: string, ...optionalParams: string[]): void {
    this.winstonLoggerErrorLevel.error(message, context, optionalParams);
  }
  warn(message: string, ...optionalParams: string[]): void {
    this.winstonLoggerWarnLevel.warn(message, optionalParams);
  }
  debug?(message: string, ...optionalParams: string[]): void {
    this.winstonLoggerDebugLevel.debug(message, optionalParams);
  }
  verbose?(message: string, ...optionalParams: string[]): void {
    this.winstonLoggerVerboseLevel.verbose(message, optionalParams);
  }
  fatal?(message: string, ...optionalParams: string[]): void {
    this.winstonLoggerFatalLevel.error(message, optionalParams);
  }
}
