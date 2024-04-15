// import type { ResearchCardT } from '@/types/research'
import type { FetchInput } from '../base/fetch.base.composable'

export const useResearchStore = defineStore('storeResearch', () => {
  const logger = useLogger('storeResearch')
  const baseFetch = useBaseFetch()

  const research = ref([])

  async function loadResearch(config: FetchInput) {
    logger.log('loadResearch start')
    try {
      const data = await baseFetch.fetchPaginatedData(config)

      logger.log('returned data', data)
      if (!data) {
        return
      }

      research.value.push(...data)
    } catch (error) {
      logger.error('Failed to load users:', error)
    }
  }

  // const countDuplicateIds = (data) => {
  //   const ids = data.map((item) => item.id)
  //   const uniqueIds = new Set(ids)
  //   return ids.length - uniqueIds.size
  // }

  return {
    research,
    loadResearch
  }
})
