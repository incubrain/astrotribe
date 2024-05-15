// import type { NewsCardT } from '@/types/news'
import type { FetchInput } from '../base/fetch.base.composable'

export const useNewsStore = defineStore('newsStore', () => {
  const logger = useLogger('newsStore')
  const baseFetch = useBaseFetch()

  const news = ref([])

  async function loadNews(input: FetchInput) {
    logger.log('loadNews start')
    try {
      const data = await baseFetch.fetchPaginatedData(input)

      logger.log('returned data', data)
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
    loadNews
  }
})
