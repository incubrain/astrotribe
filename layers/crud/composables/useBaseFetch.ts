import type { FilterBy, DBTable } from '../server/utils/base.interface'
import type { DomainKey } from './pagination.store'
import { useCookie, useRequestHeaders } from '#imports'
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

function getDataStructure(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.length > 0 ? [getDataStructure(obj[0])] : []
  } else if (typeof obj === 'object' && obj !== null) {
    const structure: Record<string, any> = {}
    for (const key in obj) {
      structure[key] = getDataStructure(obj[key])
    }
    return structure
  } else {
    return typeof obj
  }
}

export function useBaseFetch() {
  const errors = useBaseError()
  const paginationStore = usePaginationStore()
  const loading = useLoadingStore()
  const logger = useLogger('useBaseFetch')
  const apiDataStore = useApiDataStore()

  const fetch = $fetch.create({
    retryStatusCodes: [408, 409, 425, 500, 502, 503, 504],
    headers: {
      'X-USER-ID': useCookie('userId').value ?? 'no-user-id',
      'cookie': useRequestHeaders(['cookie']).cookie ?? '',
    },
    onResponseError({ error, response, request, options }) {
      console.error('onResponseError', response, response._data, error)
    },
    async onResponse({ request, response, options }) {
      const url = request.toString()
      const structure = getDataStructure(response._data)
      console.log('Captured data structure for:', url, structure)
      apiDataStore.setData(url, structure)
    },
  })

  async function fetchPaginatedData(params: FetchInput) {
    const { domainKey, endpoint, criteria } = params

    if (loading.isLoading(domainKey)) {
      return null
    }

    if (paginationStore.isDataFinished(domainKey)) {
      return null
    }

    if (!paginationStore.getPagination(domainKey)) {
      return null
    }

    loading.setLoading(domainKey, true)

    try {
      logger.info('fetchPaginatedData for', domainKey, endpoint, criteria)
      const response = await fetch(endpoint, {
        method: 'POST',
        params: {
          ...criteria,
          pagination: paginationStore.getPaginationRange(domainKey),
        },
      })

      console.log('fetchPaginatedData RESPONSE', response)

      const data = errors.server({
        response,
        devOnly: false,
        userMessage: `Sorry there was an error getting ${domainKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData errored selecting paginated ${domainKey} data from ${endpoint}`,
      })

      if (!data || !data.length || data.length < paginationStore.getPagination(domainKey)!.limit) {
        paginationStore.setDataFinished(domainKey)
      }

      await loading.setLoadingInterval(domainKey, false, 1500)
      paginationStore.incrementPagination(domainKey)

      return data
    } catch (error) {
      errors.client({
        error,
        devOnly: false,
        userMessage: `Sorry there was an error getting ${domainKey} from ${endpoint}`,
        devMessage: `fetchPaginatedData error for ${domainKey}`,
      })
    }
  }

  return {
    fetchPaginatedData,
    fetch,
  }
}
