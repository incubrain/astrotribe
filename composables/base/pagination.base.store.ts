export type StoreKey =
  | 'usersStore'
  | 'newsStore'
  | 'eventsStore'
  | 'venuesStore'
  | 'researchStore'
  | 'companiesStore'

type PaginationKey = 'from' | 'to' | undefined

export type PaginationType = {
  page: number
  limit: number
}

export interface PaginationInput {
  storeKey: StoreKey
  pagination: PaginationType
}

export const usePaginationStore = defineStore('usePaginationStore', () => {
  const logger = useLogger('usePaginationStore')
  const stores = reactive({} as Record<StoreKey, Ref<{ page: number; limit: number }>>)
  const dataFinished = ref({} as Record<StoreKey, boolean>)

  function initPagination(input: PaginationInput) {
    if (!stores[input.storeKey]) {
      stores[input.storeKey] = { page: input.pagination.page, limit: input.pagination.limit - 1 }
    }
  }

  function getPagination(storeKey: StoreKey) {
    if (!stores[storeKey]) {
      logger.warn(`Pagination settings for '${storeKey}' are not initialized.`)
      return undefined
    }
    return stores[storeKey]
  }

  function getPaginationRange(storeKey: StoreKey) {
    const pagination = getPagination(storeKey)
    if (pagination) {
      logger.log('getPaginationRange', pagination.limit, (pagination.page - 1) * pagination.limit)
      return {
        from: (pagination.page - 1) * pagination.limit,
        to: pagination.limit * pagination.page
      }
    }
    return undefined
  }

  function incrementPagination(storeKey: StoreKey) {
    1
    const currentPagination = getPagination(storeKey)
    if (currentPagination) {
      currentPagination.page++
    } else {
      logger.warn(`Attempted to increment pagination for an uninitialized store '${storeKey}'.`)
    }
  }

  function setDataFinished(storeKey: StoreKey) {
    if (stores[storeKey]) {
      dataFinished.value[storeKey] = true
    }
  }

  const isDataFinished = (storeKey: StoreKey) => dataFinished.value[storeKey]

  return {
    stores,
    isDataFinished,
    setDataFinished,
    initPagination,
    getPagination,
    incrementPagination,
    getPaginationRange
  }
})