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
  const paginationStore = usePaginationStore()
  const loading = useLoadingStore()
  const logger = useLogger('base-fetch')
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
      logger.info('Captured data structure for:', { url, structure })
      apiDataStore.setData(url, structure)
    },
  })

  return {
    fetch,
  }
}
