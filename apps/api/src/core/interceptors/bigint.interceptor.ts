// interceptors/bigint.interceptor.ts
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class BigIntSerializationInterceptor implements NestInterceptor {
  private transformValue(value: any): any {
    if (typeof value === 'bigint') {
      return value.toString()
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transformValue(item))
    }

    if (value instanceof Date) {
      return value.toISOString()
    }

    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, this.transformValue(val)]),
      )
    }

    return value
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformValue(data)))
  }
}
