import { ref, type Ref } from 'vue'
import { useErrorHandler, useLogger, AppError, ErrorType, ErrorSeverity } from '@ib/client'
import { useHttpHandler } from './http-handler'
import { getOrCreateStore } from './main.store'
import { type DomainKey, usePaginationStore, type PaginationType } from './pagination.store'
import { useRateLimit } from './rate-limit'
import type { BaseItem } from './main.store'

export function useSelectData<T extends BaseItem>(
  tableName: DomainKey,
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
  } = {},
) {
  const { select } = useHttpHandler()
  const { handleError } = useErrorHandler()
  const logger = useLogger('useSelectData')
  const store = getOrCreateStore<T>(tableName)()
  const { checkRateLimit } = useRateLimit()

  const isSelecting: Ref<boolean> = ref(false)
  let lastSelectTime = 0

  let paginationStore: ReturnType<typeof usePaginationStore> | null = null

  if (options.pagination) {
    paginationStore = usePaginationStore()
    paginationStore.initPagination({
      domainKey: tableName,
      pagination: options.pagination,
      force: true,
    })
  }

  const fetchData = async (forceFetch = false) => {
    isSelecting.value = true
    const startTime = Date.now()

    try {
      // Rate limiting
      if (options.rateLimitMs && !forceFetch) {
        await checkRateLimit('useSelectData', { limitMs: options.rateLimitMs })
      }

      const queryOptions: any = {
        columns: options.columns || '*',
        filters: options.filters,
      }

      if (options.orderBy) {
        queryOptions.order = {
          column: options.orderBy.column,
          ascending: options.orderBy.ascending ?? true,
        }
      }

      if (paginationStore) {
        const pagination = paginationStore.getPaginationRange(tableName)
        if (pagination) {
          console.log('pagination', pagination)
          queryOptions.range = pagination
        } else {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: `Pagination not initialized for ${tableName}`,
            severity: ErrorSeverity.MEDIUM,
            context: 'Data Fetching',
          })
        }
      } else if (options.limit) {
        queryOptions.range = { from: 0, to: options.limit - 1 }
      }

      const result = await select<T>(tableName, queryOptions)
      console.log('Fetch result:', result)

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
      console.log('loading more data')
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
        force: true,
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
    isSelecting,
  }
}
