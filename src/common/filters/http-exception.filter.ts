import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    const timestamp = new Date().toISOString()

    const newResponse = typeof exceptionResponse === 'object'
      ? { ...exceptionResponse, timestamp }
      : { message: exceptionResponse, timestamp }

    response.status(status).json(newResponse)
  }
}
