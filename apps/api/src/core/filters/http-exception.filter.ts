// filters/http-exception.filter.ts
import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import type { Response } from 'express'
import type { CustomLogger } from '@core/logger/custom.logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: CustomLogger) {
    this.logger.setContext('HttpExceptionFilter')
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    this.logger.error(`HTTP Exception: ${exception.message}`, exception.stack)

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: exceptionResponse,
      statusCode: status,
    })
  }
}