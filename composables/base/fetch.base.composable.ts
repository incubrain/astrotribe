import type { StoreKey } from './pagination.base.store'
import type { QueryFilter } from '@/server/utils/base.interface'

export interface FetchInput {
  storeKey: StoreKey
  endpoint: string
  config: {
    dto: string
    filter?: QueryFilter
    pagination?: {
      page: number
      limit: number
    }
  }
}

export function useBaseFetch() {
  // Generalized fetch function for any data type
  const paginationStore = usePaginationStore()
  const loading = useLoadingStore()
  const logger = useLogger('useBaseFetch')

  function handleError(error: any, context: string) {
    logger.error(`Error in ${context}: ${error.message || JSON.stringify(error)}`)
    // Additional error handling logic here, e.g., sending error details to a monitoring service
    throw createError({ message: error.message || 'An unknown error occurred' })
  }

  async function fetchPaginatedData(params) {
    const { storeKey, endpoint, criteria } = params

    if (loading.isLoading(storeKey)) {
      return null
    }

    if (paginationStore.isDataFinished(storeKey)) {
      return null
    }

    loading.setLoading(storeKey, true)

    try {
      console.log('fetchPaginatedData', storeKey, endpoint, criteria)
      const res = await $fetch(endpoint, {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        params: {
          ...criteria
        }
      })

      if (res.status !== 200) {
        throw createError({ message: `Error getting data: ${res.message}` })
      }

      if (
        !res.data ||
        !res.data.length ||
        res.data.length < paginationStore.getPagination(storeKey)!.limit
      ) {
        paginationStore.setDataFinished(storeKey)
      }

      // console.log('fetchResponse', response.data)

      loading.setLoadingInterval(storeKey, false, 5000)
      paginationStore.incrementPagination(storeKey)

      return res.data
    } catch (error) {
      handleError(error, 'fetchPaginatedData')
    }
  }

  return {
    fetchPaginatedData
  }
}
