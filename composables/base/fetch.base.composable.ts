import type { StoreKey } from './pagination.base.store'
import { useCookie, useRequestHeaders, useId } from '#imports'
import type { FilterBy, DBTable } from '@/server/utils/base.interface'

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
  // Generalized fetch function for any data type
  const toast = useToast()
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
      console.error('[fetch request error]', error, request, options)
      toast.add({
        summary: 'REQUEST ERROR:',
        detail: error.message,
        severity: 'error',
        life: 0,
        closable: true
      })
    },
    onResponseError({ error, response, request, options }) {
      toast.add({
        severity: 'error',
        summary: 'RESPONSE ERROR: ' + response.statusText,
        detail:
          error?.message ??
          response._data.message ??
          `An unknown error occurred with ${response.url}`,
        life: 0,
        closable: true
      })
      console.error('[fetch response error]', error, response, request, options)
    }
  })

  const paginationStore = usePaginationStore()
  const loading = useLoadingStore()
  const logger = useLogger('useBaseFetch')

  function handleError(error: any, context: string) {
    logger.error(`Error in ${context}: ${error.message || JSON.stringify(error)}`)
    // Additional error handling logic here, e.g., sending error details to a monitoring service
    throw createError({ message: error.message || 'An unknown error occurred' })
  }

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
      const res = await fetch(endpoint, {
        method: 'POST',
        params: {
          ...criteria,
          pagination: paginationStore.getPaginationRange(storeKey)
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

      await loading.setLoadingInterval(storeKey, false, 1500)
      paginationStore.incrementPagination(storeKey)

      return res.data
    } catch (error) {
      handleError(error, 'fetchPaginatedData')
    }
  }

  return {
    fetchPaginatedData,
    fetch
  }
}
