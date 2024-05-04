import type { DomainKey } from './pagination.base.store'
import { useCookie, useRequestHeaders, useId } from '#imports'
import type { FilterBy, DBTable } from '@/server/utils/base.interface'
import type { FetchResult } from '#app'

export interface FetchInput {
  domainKey: DomainKey
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
    onRequest({ request, options }) {},
    onRequestError({ error, request, options }) {
      console.error('onRequestError', error)
      errors.handleError(error, {
        critical: false,
        userMessage: 'there was an error fetching the data',
        devMessage: `onResponseError for`
      })
    },
    onResponseError({ error, response, request, options }) {
      console.error('onResponseError', error)
      errors.handleError(error, {
        critical: false,
        userMessage: 'there was an error fetching the data',
        devMessage: `onResponseError for ${JSON.stringify(response)}`
      })
    }
  })

  async function fetchPaginatedData(params: FetchInput) {
    const { domainKey, endpoint, criteria, pagination } = params

    if (loading.isLoading(domainKey)) {
      return null
    }

    if (paginationStore.isDataFinished(domainKey)) {
      return null
    }

    if (!paginationStore.getPagination(domainKey) && pagination) {
      paginationStore.initPagination({ domainKey, pagination })
    }

    loading.setLoading(domainKey, true)

    try {
      logger.log('fetchPaginatedData for', domainKey, endpoint, criteria)
      const response = await fetch(endpoint, {
        method: 'POST',
        params: {
          ...criteria,
          pagination: paginationStore.getPaginationRange(domainKey)
        }
      })

      console.log('fetchPaginatedData RESPONSE', response)

      const data = errors.handleFetchErrors(response, {
        critical: false,
        userMessage: `Sorry there was an error getting ${domainKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData errored selecting paginated ${domainKey} data from ${endpoint}`
      })

      if (!data || !data.length || data.length < paginationStore.getPagination(domainKey)!.limit) {
        paginationStore.setDataFinished(domainKey)
      }

      await loading.setLoadingInterval(domainKey, false, 1500)
      paginationStore.incrementPagination(domainKey)

      return data
    } catch (error) {
      errors.handleError(error, {
        critical: false,
        userMessage: `Sorry there was an error getting ${domainKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData error for ${domainKey}`
      })
    }
  }

  return {
    fetchPaginatedData,
    fetch
  }
}
