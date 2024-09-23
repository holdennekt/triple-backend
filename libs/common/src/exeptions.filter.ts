import {
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

export type ExceptionResponse = {
  statusCode: number;
  message: string | Record<string, any>;
};

@Catch()
export class ExceptionsFilter implements RpcExceptionFilter {
  catch(
    exception: unknown,
    _host: ArgumentsHost,
  ): Observable<ExceptionResponse> {
    if (exception instanceof HttpException)
      return throwError(() => ({
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
      }));
    else if (exception instanceof Error)
      return throwError(() => ({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      }));
  }
}
