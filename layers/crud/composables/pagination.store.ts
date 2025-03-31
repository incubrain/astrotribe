export type DomainKey =
  | 'users'
  | 'news'
  | 'events'
  | 'venues'
  | 'research'
  | 'companies'
  | 'chats'
  | 'feedbacks'
  | 'currentUser'
  | 'chat'
  | 'auth'

export type PaginationType = {
  page: number
  limit: number
}

export interface PaginationInput {
  domainKey: DomainKey
  pagination: PaginationType
  force?: boolean
}

export const usePaginationStore = defineStore('paginationStore', () => {
  const logger = console
  const stores = reactive({} as Record<DomainKey, Ref<{ page: number; limit: number }>>)
  const dataFinished = ref({} as Record<DomainKey, boolean>)

  function initPagination(input: PaginationInput) {
    if (!stores[input.domainKey] || input.force) {
      // -1 for supabase because it is 0 indexed
      console.log('initPagination', input.force)
      stores[input.domainKey] = {
        page: input.pagination.page,
        limit: input.pagination.limit - 1,
      }
    }
  }

  function getPagination(domainKey: DomainKey) {
    if (!stores[domainKey]) {
      logger.warn(`Pagination settings for '${domainKey}' is not initialized.`)
      return null
    }

    return stores[domainKey]
  }

  function getPaginationRange(domainKey: DomainKey) {
    const pagination = getPagination(domainKey)
    if (pagination) {
      logger.info('getPaginationRange', pagination.limit, (pagination.page - 1) * pagination.limit)
      return {
        from: (pagination.page - 1) * pagination.limit,
        to: pagination.limit * pagination.page,
      }
    }
    return undefined
  }

  function incrementPagination(domainKey: DomainKey) {
    const currentPagination = getPagination(domainKey)
    if (currentPagination) {
      currentPagination.page++
    } else {
      logger.warn(`Attempted to increment pagination for an uninitialized store '${domainKey}'.`)
    }
  }

  function setDataFinished(domainKey: DomainKey) {
    if (stores[domainKey]) {
      dataFinished.value[domainKey] = true
    }
  }

  const isDataFinished = (domainKey: DomainKey) => dataFinished.value[domainKey]

  return {
    stores,
    isDataFinished,
    setDataFinished,
    initPagination,
    getPagination,
    incrementPagination,
    getPaginationRange,
  }
})
