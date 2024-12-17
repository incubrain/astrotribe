import { Injectable } from '@nestjs/common';
import { PaginatedQuery, PaginatedResponse, PaginationMeta } from '@core/types/pagination.types';

@Injectable()
export class PaginationService {
  getPaginationMeta(
    total: number,
    query: PaginatedQuery
  ): PaginationMeta {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  getPaginatedResponse<T>(
    items: T[],
    total: number,
    query: PaginatedQuery
  ): PaginatedResponse<T> {
    return {
      items,
      meta: this.getPaginationMeta(total, query),
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  getSkipTake(query: PaginatedQuery): { skip: number; take: number } {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}
