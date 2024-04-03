import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';

@Injectable()
export class GraphqlLoggingInterceptor implements NestInterceptor {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = GqlExecutionContext.create(context);
    const resolverName = ctx.getClass().name;
    const info = ctx.getInfo();
    const args = ctx.getArgs();

    const now = Date.now();
    this.logger.log({
      level: 'info',
      message: `Incoming GQL request: ${resolverName}.${info.fieldName}`,
      additionalDetails: {
        operation: info.operation.operation,
        variables: JSON.stringify(this.extractVariables(args)),
        fieldName: info.fieldName,
      },
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          level: 'info',
          message: `Outgoing GQL response: ${resolverName}.${info.fieldName} in ${Date.now() - now}ms`,
        });
      }),
      catchError((error) => {
        this.logError(resolverName, info.fieldName, error); // Adjusted to call logError method
        return throwError(() => error);
      }),
    );
  }

  private extractVariables(args: unknown): unknown {
    // Implement your logic here to sanitize or select specific arguments for logging
    return args;
  }
  private logError(
    resolverName: string,
    fieldName: string,
    error: GraphQLError & { response: unknown },
  ): void {
    // Adjusted method to provide more information about the error
    const errorMessage = error.message;
    const errorCode = error.extensions?.code || 'UNDEFINED_CODE';
    const stackTrace = error.stack || null; // Capture the stack trace if available

    this.logger.error({
      message: `Error in GQL request: ${resolverName}.${fieldName}`,
      errorDetails: {
        message: errorMessage,
        code: errorCode,
        response: JSON.stringify(error.response),
        stackTrace: stackTrace, // Include the stack trace in the error details
        details: error, // Include the stack trace in the error details
      },
    });
  }
}
