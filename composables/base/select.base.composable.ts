import {
  useErrorHandler,
  AppError,
  ErrorType,
  ErrorSeverity
} from './error-handler.base.composable'
import { useHttpHandler } from './http-handler.base.composable'
import { useLogger } from './logger.base.composable'
import { getOrCreateStore } from './utils.base.composable'
import { usePaginationStore, type PaginationType } from './pagination.base.store'

export function useSelectData<T extends { id: string | number }>(
  tableName: string,
  options: {
    columns?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    initialFetch?: boolean
    pagination?: PaginationType
    limit?: number
    refreshRelated?: () => Promise<void>
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
  } = {}
) {
  const { select } = useHttpHandler()
  const { handleError } = useErrorHandler()
  const logger = useLogger('useSelectData')
  const store = getOrCreateStore<T>(tableName)()
  const isSelecting: Ref<boolean> = ref(false)
  let lastSelectTime = 0

  let paginationStore: ReturnType<typeof usePaginationStore> | null = null

  if (options.pagination) {
    paginationStore = usePaginationStore()
    paginationStore.initPagination({
      domainKey: tableName,
      pagination: options.pagination,
      force: true
    })
  }

  const fetchData = async (forceFetch = false) => {
    isSelecting.value = true
    const startTime = Date.now()

    try {
      // Rate limiting
      if (options.rateLimitMs && !forceFetch) {
        const timeSinceLastSelect = startTime - lastSelectTime
        if (timeSinceLastSelect < options.rateLimitMs) {
          await new Promise((resolve) =>
            setTimeout(resolve, options.rateLimitMs ?? 0 - timeSinceLastSelect)
          )
        }
      }

      let queryOptions: any = {
        columns: options.columns || '*',
        filters: options.filters
      }

      if (options.orderBy) {
        queryOptions.order = {
          column: options.orderBy.column,
          ascending: options.orderBy.ascending ?? true
        }
      }

      if (paginationStore) {
        const pagination = paginationStore.getPaginationRange(tableName)
        if (pagination) {
          queryOptions.range = { from: pagination.from, to: pagination.to }
        } else {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: `Pagination not initialized for ${tableName}`,
            severity: ErrorSeverity.MEDIUM,
            context: 'Data Fetching'
          })
        }
      } else if (options.limit) {
        queryOptions.limit = options.limit
      }

      const result = await select<T>(tableName, queryOptions)

      // Audit logging
      if (options.auditLog) {
        await options.auditLog('SELECT', { tableName, options: queryOptions })
      }

      lastSelectTime = Date.now()
      return result
    } catch (error: any) {
      handleError(error, 'Error selecting data')
      throw error
    } finally {
      isSelecting.value = false
    }
  }

  const loadMore = async () => {
    if (paginationStore) {
      const newData = await fetchData()
      if (newData.length === 0) {
        paginationStore.setDataFinished(tableName)
      } else {
        store.addItems(newData)
        paginationStore.incrementPagination(tableName)
      }
    } else {
      const data = await fetchData()
      store.setItems(data)
    }

    // Refresh related data if needed
    if (options.refreshRelated) {
      await options.refreshRelated()
    }
  }

  const refresh = async () => {
    if (paginationStore) {
      paginationStore.initPagination({
        domainKey: tableName,
        pagination: options.pagination!,
        force: true
      })
    }
    store.clearItems()
    await loadMore()
  }

  if (options.initialFetch) {
    loadMore()
  }

  return {
    store,
    loadMore,
    refresh,
    isSelecting
  }
}