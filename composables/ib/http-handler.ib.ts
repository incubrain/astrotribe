import type { PostgrestResponse, PostgrestError } from '@supabase/supabase-js'
import {
  useErrorHandler,
  ErrorType,
  ErrorSeverity,
  AppError,
  mapErrorSeverity,
  mapErrorType,
  retryableStatusCodes,
} from './error-handler.ib'
import { useLogger } from './logger.ib'
import { getOrCreateStore } from './main.ib.store'
import { usePaginationStore, type PaginationType } from './pagination.ib.store'

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'contains'
  | 'containedBy'
  | 'overlaps'
  | 'textSearch'
  | 'match'
  | 'not'
  | 'or'
  | 'and'
  | 'rangeGt'
  | 'rangeGte'
  | 'rangeLt'
  | 'rangeLte'
  | 'rangeAdjacent'

type FilterOptionValue = string | number | boolean | null | any[] | Record<string, unknown>

type FilterOption = {
  [K in FilterOperator]?: K extends 'not'
    ? FilterOption
    : K extends 'or' | 'and'
      ? string
      : FilterOptionValue
}

type Filters = Record<string, FilterOption>

interface SelectOptions<T> {
  columns?: keyof T | Array<keyof T> | string
  filters?: Filters
  range?: { from: number; to: number }
  order?: { column: keyof T; ascending: boolean }
}

function applyFilter(query: any, column: string, filter: FilterOption): any {
  const [operator, value] = Object.entries(filter)[0]
  switch (operator) {
    case 'eq':
      return query.eq(column, value)
    case 'neq':
      return query.neq(column, value)
    case 'gt':
      return query.gt(column, value)
    case 'gte':
      return query.gte(column, value)
    case 'lt':
      return query.lt(column, value)
    case 'lte':
      return query.lte(column, value)
    case 'like':
      return query.like(column, value)
    case 'ilike':
      return query.ilike(column, value)
    case 'is':
      return query.is(column, value)
    case 'in':
      return query.in(column, value as any[])
    case 'contains':
      return query.contains(column, value)
    case 'containedBy':
      return query.containedBy(column, value)
    case 'rangeGt':
      return query.rangeGt(column, value)
    case 'rangeGte':
      return query.rangeGte(column, value)
    case 'rangeLt':
      return query.rangeLt(column, value)
    case 'rangeLte':
      return query.rangeLte(column, value)
    case 'rangeAdjacent':
      return query.rangeAdjacent(column, value)
    case 'overlaps':
      return query.overlaps(column, value)
    case 'textSearch':
      return query.textSearch(column, value as string, { config: 'english' })
    case 'match':
      return query.match(column, value as Record<string, unknown>)
    case 'not':
      return applyFilter(query.not(), column, value as FilterOption)
    case 'or':
      return query.or(value as string)
    case 'and':
      return query.and(value as string)
    default:
      console.warn(`Unsupported filter operator: ${operator}`)
      return query
  }
}

export function useHttpHandler() {
  const supabase = useSupabaseClient()
  const { handleError } = useErrorHandler()
  const logger = useLogger('HttpHandler')

  async function handleDatabaseOperation<T>(
    operation: () => Promise<PostgrestResponse<T>>,
    context: string,
    maxRetries: number = 3,
  ): Promise<T> {
    let retries = 0
    while (retries < maxRetries) {
      try {
        const response = await operation()
        logger.debug(`${context} response:`, response)

        if (response.error) {
          throw response.error
        }
        return response.data as T
      } catch (error: unknown) {
        retries++
        logger.warn(`${context} failed. Attempt ${retries} of ${maxRetries}`)

        const pgError = error as PostgrestError
        const errorType = mapErrorType(pgError)
        const errorSeverity = mapErrorSeverity(pgError)

        if (
          retries >= maxRetries ||
          !Object.keys(retryableStatusCodes).includes(pgError.code?.toString() || '')
        ) {
          const appError = new AppError({
            type: errorType,
            message:
              pgError.message ||
              retryableStatusCodes[pgError.code as keyof typeof retryableStatusCodes] ||
              'Database operation failed',
            severity: errorSeverity,
            code: pgError.code,
            context: context,
            pgError: pgError.details || pgError.hint || pgError.message,
            operation: context,
          })
          throw handleError(appError)
        }

        // Exponential backoff with jitter
        const backoffTime = Math.min(1000 * 2 ** retries + Math.random() * 1000, 10000)
        await new Promise((resolve) => setTimeout(resolve, backoffTime))
      }
    }
    throw new Error('Max retries reached')
  }

  async function insert<T>(
    tableName: string,
    data: T,
    options: { columns?: string } = {},
  ): Promise<T> {
    return handleDatabaseOperation(
      async () =>
        await supabase
          .from(tableName)
          .insert(data)
          .select(options.columns || '*'),
      `Insert into ${tableName}`,
    )
  }

  async function update<T>(
    tableName: string,
    id: string | number,
    data: Partial<T>,
    options: { columns?: string } = {},
  ): Promise<T> {
    return handleDatabaseOperation(
      async () =>
        await supabase
          .from(tableName)
          .update(data)
          .eq('id', id)
          .select(options.columns || '*'),
      `Update ${tableName}`,
    )
  }

  async function remove(tableName: string, id: string | number): Promise<void> {
    await handleDatabaseOperation(
      async () => await supabase.from(tableName).delete().eq('id', id),
      `Delete from ${tableName}`,
    )
  }

  async function select<T>(tableName: string, options: SelectOptions<T> = {}): Promise<T[]> {
    let query = supabase.from(tableName).select(options.columns || '*')

    if (options.filters) {
      Object.entries(options.filters).forEach(([column, filterOption]) => {
        console.log('column:', column, 'filterOption:', filterOption)
        query = applyFilter(query, column, filterOption)
      })
    }

    if (options.range) {
      query = query.range(options.range.from, options.range.to)
    }

    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending })
    }

    return handleDatabaseOperation(() => query, `Select from ${tableName}`)
  }

  return {
    insert,
    update,
    remove,
    select,
  }
}
