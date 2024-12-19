export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedQuery {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}
