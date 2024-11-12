import { useLogger } from '@ib/logger'
import type { FetchInput } from '#imports'

export const useNewsStore = defineStore('newsStore', () => {
  const logger = useLogger('newsStore')
  const baseFetch = useBaseFetch()

  const news = ref([])

  async function loadNews(input: FetchInput) {
    logger.info('loadNews start')
    try {
      const data = await baseFetch.fetchPaginatedData(input)

      logger.info('returned data', data)
      if (!data) {
        return
      }

      news.value.push(...data)
    } catch (error) {
      logger.error('Failed to load news:', error)
    }
  }

  // const countDuplicateIds = (data) => {
  //   const ids = data.map((item) => item.id)
  //   const uniqueIds = new Set(ids)
  //   return ids.length - uniqueIds.size
  // }

  return {
    news,
    loadNews,
  }
})
