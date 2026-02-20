import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'Internal server error',
      error: exception.name || 'UnknownError',
      stack: exception.stack || null,
      timestamp: new Date().toISOString(),
    });
  }
}