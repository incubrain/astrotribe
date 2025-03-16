import { unref, watch, type MaybeRef } from 'vue'
import { useHttpHandler } from './useHttpHandler'
import { getOrCreateStore } from './main.store'
import { usePaginationStore, type PaginationType } from './pagination.store'
import { useRateLimit } from './useRateLimit'

export function useSelectData<T extends { id: string | number }>(
  tableName: string,
  optionsRef: MaybeRef<{
    columns?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean; nullsFirst?: boolean }
    initialFetch?: boolean
    pagination?: PaginationType
    limit?: number
    refreshRelated?: () => Promise<void>
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
    storeKey?: string
    enabled?: MaybeRef<boolean>
  }> = {},
) {
  const options = computed(() => unref(optionsRef) || {})
  const isEnabled = computed(() => unref(options.value.enabled) ?? true)
  const storeKey = options.value.storeKey || tableName

  const { select } = useHttpHandler()
  const store = getOrCreateStore<T>(storeKey)()
  const { checkRateLimit } = useRateLimit()

  const isSelecting: Ref<boolean> = ref(false)
  let lastSelectTime = 0

  let paginationStore: ReturnType<typeof usePaginationStore> | null = null

  if (options.value.pagination) {
    paginationStore = usePaginationStore()
    paginationStore.initPagination({
      domainKey: storeKey,
      pagination: options.value.pagination,
      force: true,
    })
  }

  const fetchData = async (forceFetch = false) => {
    isSelecting.value = true
    const startTime = Date.now()

    try {
      // Rate limiting
      if (options.value.rateLimitMs && !forceFetch) {
        await checkRateLimit('useSelectData', { limitMs: options.value.rateLimitMs })
      }

      const queryOptions: any = {
        columns: options.value.columns || '*',
        filters: options.value.filters,
      }

      if (options.value.orderBy) {
        queryOptions.order = {
          column: options.value.orderBy.column,
          ascending: options.value.orderBy.ascending ?? true,
          nullsFirst: options.value.orderBy.nullsFirst ?? true,
        }
      }

      if (paginationStore) {
        const pagination = paginationStore.getPaginationRange(storeKey)
        if (pagination) {
          console.log('pagination', pagination)
          queryOptions.range = pagination
        } else {
          throw new Error('Pagination range is not defined')
        }
      } else if (options.value.limit) {
        queryOptions.range = { from: 0, to: options.value.limit - 1 }
      }

      const result = await select<T>(tableName, queryOptions)
      console.log('Fetch result:', result)

      // Audit logging
      if (options.value.auditLog) {
        await options.value.auditLog('SELECT', { tableName, options: queryOptions })
      }

      lastSelectTime = Date.now()
      return result
    } catch (error: any) {
      console.error('Error selecting data', { error })
      throw error
    } finally {
      isSelecting.value = false
    }
  }

  const changeFilters = async (filters: Record<string, any>) => {
    options.value.filters = { ...options.value.filters, ...filters }
    Object.keys(filters).forEach((filter) => {
      const optionFilter =
        options.value.filters && Object.keys(options.value.filters).find((key) => key === filter)

      if (optionFilter && filters[filter] == null) delete options.value.filters[filter]
    })

    if (paginationStore) {
      paginationStore.initPagination({
        domainKey: storeKey,
        pagination: options.value.pagination!,
        force: true,
      })
    }
    store.clearItems()
    const data = await fetchData()
    store.setItems(data)
  }

  const loadMore = async (filters?: Record<string, any>) => {
    if (paginationStore) {
      console.log('loading more data')
      const newData = await fetchData()
      if (newData.length === 0) {
        paginationStore.setDataFinished(storeKey)
      } else {
        store.addItems(newData)
        paginationStore.incrementPagination(storeKey)
      }
    } else {
      if (filters) optionsRef.filters = { ...optionsRef.filters, ...filters }
      const data = await fetchData()
      store.setItems(data)
    }

    // Refresh related data if needed
    if (options.value.refreshRelated) {
      await options.value.refreshRelated()
    }
  }

  const refresh = async () => {
    if (paginationStore) {
      paginationStore.initPagination({
        domainKey: storeKey,
        pagination: options.value.pagination!,
        force: true,
      })
    }
    store.clearItems()
    await loadMore()
  }

  if (options.value.initialFetch && isEnabled.value) {
    loadMore()
  }

  watch(isEnabled, (newEnabled) => {
    if (newEnabled && options.value.initialFetch) {
      loadMore()
    }
  })

  return {
    store,
    changeFilters,
    loadMore,
    refresh,
    isSelecting,
  }
}
