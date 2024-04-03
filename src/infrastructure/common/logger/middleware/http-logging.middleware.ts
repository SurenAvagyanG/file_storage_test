import { Injectable, Logger } from '@nestjs/common';
import { LoggingMiddleware } from './logging.middleware';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggingMiddleware extends LoggingMiddleware {
  protected readonly logger: Logger = new Logger(this.constructor.name);
  isErroneousStatusCode(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 600;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      const basicRequestMetaInfo = {
        method,
        originalUrl,
        statusCode,
        contentLength,
        userAgent,
        ip,
        timestamp: new Date(),
      };

      if (this.isErroneousStatusCode(statusCode)) {
        const additionalRequestMetaInfo = {
          body: req.body,
          query: req.query,
          params: req.params,
          headers: req.headers,
        };
        this.logger.error({
          ...basicRequestMetaInfo,
          ...additionalRequestMetaInfo,
        });
      } else {
        this.logger.log(basicRequestMetaInfo);
      }
    });
    next();
  }
}
