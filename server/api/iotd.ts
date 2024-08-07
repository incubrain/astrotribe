import * as z from 'zod'

export const NasaImgSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  date: z.string(),
  url: z.string(),
  hdurl: z.string(),
  media_type: z.string(),
  copyright: z.string(),
  service_version: z.string()
})

export type NasaImgT = z.infer<typeof NasaImgSchema>

export default defineEventHandler(async (event) => {
  const log = useServerLogger('nasa-iotd')
  // use date for KV storage
  const date = new Date().toISOString().split('T')[0]
  const cacheKey = `nasa-iotd:${date}`
  const storage = useStorage('data')

  // Check if item exists in storage
  let nasaImg: NasaImgT | null = null
  const isItemInStorage = await storage.hasItem(cacheKey)
  log.info(`Is ${cacheKey} in storage: ${isItemInStorage}`)
  if (isItemInStorage) {
    // Get item from storage
    nasaImg = await storage.getItem<NasaImgT>(cacheKey)!
    log.info(`Got ${cacheKey} from storage: `, nasaImg)
  } else {
    // Get the item for the previous day
    const previousDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const previousCacheKey = `nasa-iotd:${previousDay}`

    const isPreviousItemInStorage = await storage.hasItem(previousCacheKey)
    if (isPreviousItemInStorage) {
      nasaImg = await storage.getItem<NasaImgT>(previousCacheKey)!
      log.info(`Got ${previousCacheKey} from storage: `, nasaImg)
    }
  }

  if (!nasaImg) {
    log.info('No iotd in storage')
    return false
  }

  return nasaImg
})
