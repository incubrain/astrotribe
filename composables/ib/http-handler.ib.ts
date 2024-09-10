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
        const { data, error } = await operation()
        if (error) {
          throw error
        }
        return data as T
      } catch (error: unknown) {
        retries++
        logger.warn(`${context} failed. Attempt ${retries} of ${maxRetries}`)

        const pgError = error as PostgrestError
        const errorType = mapErrorType(pgError)
        const errorSeverity = mapErrorSeverity(pgError)

        if (
          retries >= maxRetries
          || !Object.keys(retryableStatusCodes).includes(pgError.code?.toString() || '')
        ) {
          const appError = new AppError({
            type: errorType,
            message:
              pgError.message
              || retryableStatusCodes[pgError.code as keyof typeof retryableStatusCodes]
              || 'Database operation failed',
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

  async function select<T>(
    tableName: string,
    options: {
      columns?: string
      filters?: Record<string, any>
      range?: { from: number, to: number }
      order?: { column: string, ascending: boolean }
    } = {},
  ): Promise<T[]> {
    let query = supabase.from(tableName).select(options.columns || '*')

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
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
