import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export abstract class LoggerMiddleware implements NestMiddleware {
  abstract use(req: Request, res: Response, next: NextFunction): void;
}
