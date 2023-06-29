import logger from '../utils/logger'
import { NasaImg } from '../../types'

export default defineEventHandler(async (event) => {
  // use date for KV storage
  const date = new Date().toISOString().split('T')[0]
  const cacheKey = `nasa-iotd:${date}`
  const storage = useStorage('data')

  // Check if item exists in storage
  let nasaImg: NasaImg | null = null
  const isItemInStorage = await storage.hasItem(cacheKey)
  logger.info(`Is ${cacheKey} in storage: ${isItemInStorage}`)
  if (isItemInStorage) {
    // Get item from storage
    nasaImg = await storage.getItem<NasaImg>(cacheKey)!
    logger.info(`Got ${cacheKey} from storage: `, nasaImg)
  } else {
    // Get the item for the previous day
    const previousDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const previousCacheKey = `nasa-iotd:${previousDay}`

    const isPreviousItemInStorage = await storage.hasItem(previousCacheKey)
    if (isPreviousItemInStorage) {
      nasaImg = await storage.getItem<NasaImg>(previousCacheKey)!
      logger.info(`Got ${previousCacheKey} from storage: `, nasaImg)
    }
  }

  if (!nasaImg) {
    logger.info('No iotd in storage')
    return false
  }

  return nasaImg
})
