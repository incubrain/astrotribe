import { z } from 'zod'
import logger from '../../utils/logger'

const imageObject = z.object({
  title: z.string(),
  explanation: z.string(),
  date: z.string(),
  url: z.string(),
  hdurl: z.string(),
  media_type: z.string(),
  copyright: z.string(),
  service_version: z.string()
})

type NasaImg = z.infer<typeof imageObject>

export default defineEventHandler(async (event) => {
  try {
    let nasaImg: NasaImg | null
    const date = new Date().toISOString().split('T')[0]
    const kvForCache = `nasa-iotd:${date}`
    const storage = useStorage('data')

    const nasaKey = process.env.NASA_API_KEY
    if (!nasaKey) {
      throw new Error('NASA_API_KEY not set in environment variables')
    }

    let unvalidated
    try {
      unvalidated = await $fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`)
    } catch (error) {
      logger.error('Error fetching data from NASA API', error)
      throw error
    }

    // Validate with zod
    logger.info(`Validating ${kvForCache} data`)
    try {
      nasaImg = imageObject.parse(unvalidated)
    } catch (error) {
      logger.error('Error validating data', error)
      throw error
    }

    // Store in storage
    try {
      logger.info(`Storing ${kvForCache} in storage`)
      await storage.setItem(kvForCache, nasaImg)
    } catch (error) {
      logger.error('Error storing data', error)
      throw error
    }
  } catch (error) {
    return { message: `Error: ${error.message}`, status: 500 }
  }
  return { message: 'Success fetching iotd', status: 200 }
})
