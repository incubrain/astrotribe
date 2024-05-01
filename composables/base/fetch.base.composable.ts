import type { StoreKey } from './pagination.base.store'
import { useCookie, useRequestHeaders, useId } from '#imports'
import type { FilterBy, DBTable } from '@/server/utils/base.interface'
import type { FetchResult } from '#app'

export interface FetchInput {
  storeKey: StoreKey
  endpoint: string
  pagination?: {
    page: number
    limit: number
  }
  criteria: {
    dto: string
    filterBy?: FilterBy<DBTable>
  }
}



export function useBaseFetch() {
  const errors = useBaseError()
  const paginationStore = usePaginationStore()
  const loading = useLoadingStore()
  const logger = useLogger('useBaseFetch')

  const fetch = $fetch.create({
    retryStatusCodes: [
      408, // Request Timeout
      409, // Conflict
      425, // Too Early
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504 // Gateway Timeout
    ],
    headers: {
      'X-USER-ID': useCookie('userId').value ?? 'no-user-id',
      cookie: useRequestHeaders(['cookie']).cookie ?? ''
    },
    onRequest({ request, options }) {
      console.log('[fetch request]', request, options)
    },
    onRequestError({ error, request, options }) {
      console.error('onRequestError', error)
    },
    onResponseError({ error, response, request, options }) {
      console.error('onResponseError', error)
    }
  })

  async function fetchPaginatedData(params: FetchInput) {
    const { storeKey, endpoint, criteria, pagination } = params

    if (loading.isLoading(storeKey)) {
      return null
    }

    if (paginationStore.isDataFinished(storeKey)) {
      return null
    }

    if (!paginationStore.getPagination(storeKey) && pagination) {
      paginationStore.initPagination({ storeKey, pagination })
    }

    loading.setLoading(storeKey, true)

    try {
      logger.log('fetchPaginatedData for', storeKey, endpoint, criteria)
      const response = await fetch(endpoint, {
        method: 'POST',
        params: {
          ...criteria,
          pagination: paginationStore.getPaginationRange(storeKey)
        }
      })

      console.log('fetchPaginatedData RESPONSE', response)

      const data = errors.handleFetchErrors(response, {
        critical: false,
        userMessage: `Sorry there was an error getting ${storeKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData errored selecting paginated ${storeKey} data from ${endpoint}`
      })

      if (!data || !data.length || data.length < paginationStore.getPagination(storeKey)!.limit) {
        paginationStore.setDataFinished(storeKey)
      }

      await loading.setLoadingInterval(storeKey, false, 1500)
      paginationStore.incrementPagination(storeKey)

      return data
    } catch (error) {
      errors.handleError(error, {
        critical: false,
        dataType: 'paginated',
        operation: 'select',
        userMessage: `Sorry there was an error getting ${storeKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData client error for ${storeKey}`
      })
    }
  }

  return {
    fetchPaginatedData,
    fetch
  }
}
