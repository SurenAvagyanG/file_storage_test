import { LoggerService as NestLoggerService } from '@nestjs/common';

export abstract class LoggerService implements NestLoggerService {
  abstract warn(message: string, ...optionalParams: string[]): void;
  abstract log(message: string, ...optionalParams: string[]): void;
  abstract error(message: string, ...optionalParams: string[]): void;
}
