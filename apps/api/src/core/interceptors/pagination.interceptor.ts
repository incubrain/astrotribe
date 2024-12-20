// templates/core/interceptors/pagination.interceptor.ejs
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { PaginatedResponse } from '@types'

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, PaginatedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<PaginatedResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already paginated, return as is
        if (this.isPaginated(data)) {
          return data
        }

        // Get pagination params from request query
        const request = context.switchToHttp().getRequest()
        const { page = 1, limit = 10 } = request.query

        // If data is an array, paginate it
        if (Array.isArray(data)) {
          const total = data.length
          const totalPages = Math.ceil(total / limit)
          const start = (page - 1) * limit
          const end = start + limit

          return {
            data: data.slice(start, end),
            meta: {
              total,
              page: Number(page),
              limit: Number(limit),
              totalPages,
              hasNextPage: end < total,
              hasPreviousPage: start > 0,
            },
            success: true,
            timestamp: new Date().toISOString(),
          }
        }

        // If not an array, wrap in paginated response
        return {
          data: [data],
          meta: {
            total: 1,
            page: 1,
            limit: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          success: true,
          timestamp: new Date().toISOString(),
        }
      }),
    )
  }

  private isPaginated(data: any): data is PaginatedResponse<T> {
    return (
      data &&
      'data' in data &&
      'meta' in data &&
      'total' in data.meta &&
      'page' in data.meta &&
      'limit' in data.meta &&
      'totalPages' in data.meta
    )
  }
}
