import { usePaginationStore } from './pagination.base.store'
import { useBaseError } from './useBaseError'
import { getOrCreateStore } from './utils.base.composable'

export async function useSelectData<T>(
  tableName: string,
  options: {
    columns?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    initialFetch?: boolean
    pagination?: PaginationType
    limit?: number
  } = {}
) {
  const supabase = useSupabaseClient()
  const handle = useBaseError()
  const logger = useLogger('useSelectData')
  const store = getOrCreateStore<T>(tableName)()

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
    let query = supabase.from(tableName).select(options.columns || '*')

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      })
    }

    if (paginationStore) {
      const pagination = paginationStore.getPaginationRange(tableName)
      if (pagination) {
        query = query.range(pagination.from, pagination.to)
      } else {
        throw new Error(`Pagination not initialized for ${tableName}`)
      }
    } else if (options.limit) {
      query = query.limit(options.limit)
    }

    const response = await query

    return handle.server({
      response,
      devOnly: true,
      userMessage: `Failed to fetch ${tableName} data`,
      devMessage: `Error fetching ${tableName} data from ${tableName}`
    }) as T[]
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
    await loadMore()
  }

  return {
    store,
    loadMore,
    refresh
  }
}
