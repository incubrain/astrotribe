import type { PostgrestResponse, PostgrestError } from '@supabase/supabase-js'

import { getOrCreateStore } from './main.store'
import { usePaginationStore, type PaginationType } from './pagination.store'

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
  order?: { column: keyof T; ascending: boolean; nullsFirst?: boolean }
}

function applyFilter(query: any, column: string, filter: FilterOption): any {
  // Handle each filter operator in the filter object
  return Object.entries(filter).reduce((acc, [operator, value]) => {
    console.log('operator:', operator, value)
    if (typeof operator !== 'string') {
      return acc
    }

    switch (operator as FilterOperator) {
      case 'eq':
        return acc.eq(column, value)
      case 'neq':
        return acc.neq(column, value)
      case 'gt':
        return acc.gt(column, value)
      case 'gte':
        return acc.gte(column, value)
      case 'lt':
        return acc.lt(column, value)
      case 'lte':
        return acc.lte(column, value)
      case 'like':
        return acc.like(column, value)
      case 'ilike':
        return acc.ilike(column, value)
      case 'is':
        return acc.is(column, value)
      case 'in':
        return acc.in(column, value as any[])
      case 'contains':
        return acc.contains(column, value)
      case 'containedBy':
        return acc.containedBy(column, value)
      case 'rangeGt':
        return acc.rangeGt(column, value)
      case 'rangeGte':
        return acc.rangeGte(column, value)
      case 'rangeLt':
        return acc.rangeLt(column, value)
      case 'rangeLte':
        return acc.rangeLte(column, value)
      case 'rangeAdjacent':
        return acc.rangeAdjacent(column, value)
      case 'overlaps':
        return acc.overlaps(column, value)
      case 'textSearch':
        return acc.textSearch(column, value as string, { config: 'english' })
      case 'match':
        return acc.match(column, value as Record<string, unknown>)
      case 'not':
        return acc.not(column, Object.keys(value)[0], `(${Object.values(value)[0].join(',')})`)
      case 'or':
        return acc.or(value as string)
      case 'and':
        return acc.and(value as string)
      default:
        console.warn(`Unsupported filter operator: ${operator}`)
        return acc
    }
  }, query)
}

export function useHttpHandler() {
  const supabase = useSupabaseClient()
  const logger = console

  async function handleDatabaseOperation<T>(
    operation: () => Promise<PostgrestResponse<T>>,
    context: string,
    maxRetries: number = 3,
  ): Promise<T> {
    let retries = 0
    while (retries < maxRetries) {
      try {
        const response = await operation()
        // logger.debug(`${context} response:`, response)

        if (response.error) {
          throw response.error
        }
        return response.data as T
      } catch (error: unknown) {
        retries++
        logger.warn(`${context} failed. Attempt ${retries} of ${maxRetries}`)

        const pgError = error as PostgrestError

        // if (
        //   retries >= maxRetries ||
        //   !Object.keys(retryableStatusCodes).includes(pgError.code?.toString() || '')
        // ) {
        //   const appError = new AppError({
        //     type: errorType,
        //     message:
        //       pgError.message ||
        //       retryableStatusCodes[pgError.code as keyof typeof retryableStatusCodes] ||
        //       'Database operation failed',
        //     severity: errorSeverity,
        //     code: pgError.code,
        //     context: context,
        //     pgError: pgError.details || pgError.hint || pgError.message,
        //     operation: context,
        //   })
        //   throw logger.error(appError)
        // }

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
    console.log('OPTIONS FILTERS', options.filters)
    // Apply filters using direct query builder methods
    if (options.filters) {
      Object.entries(options.filters).forEach(([column, filter]) => {
        Object.entries(filter).forEach(([operator, value]) => {
          switch (operator) {
            case 'eq':
              query = query.eq(column, value)
              break
            case 'neq':
              query = query.neq(column, value)
              break
            case 'gt':
              query = query.gt(column, value)
              break
            case 'gte':
              query = query.gte(column, value)
              break
            case 'lt':
              query = query.lt(column, value)
              break
            case 'lte':
              query = query.lte(column, value)
              break
            case 'in':
              query = query.in(column, value as any[])
              break
            case 'is':
              query = query.is(column, value)
              break
            case 'like':
              query = query.like(column, value)
              break
            // Add other operators as needed
          }
        })
      })
    }

    if (options.range) {
      query = query.range(options.range.from, options.range.to)
    }

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
        nullsFirst: options.order.nullsFirst,
      })
    }

    console.log('Final query config:', query) // Debug log

    return handleDatabaseOperation(() => query, `Select from ${tableName}`)
  }

  return {
    insert,
    update,
    remove,
    select,
  }
}
