// interceptors/logging.interceptor.ts
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { CustomLogger } from '@core/logger/custom.logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: CustomLogger) {
    this.logger.setDomain('logging')
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.url
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${url} took ${Date.now() - now}ms`)
      }),
    )
  }
}
