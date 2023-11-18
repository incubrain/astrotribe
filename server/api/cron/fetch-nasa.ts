import { NasaImgSchema } from '@/types/nasa'
import type { NasaImgType } from '@/types/nasa'

export default defineEventHandler(async (event) => {
  try {
    let nasaImg: NasaImgType | null
    const date = new Date().toISOString().split('T')[0]
    const kvForCache = `nasa-iotd:${date}`
    // const storage = useStorage('data')

    const nasaKey = process.env.NASA_API_KEY
    if (!nasaKey) {
      throw createError('NASA_API_KEY not set in environment variables')
    }

    let unvalidated
    try {
      unvalidated = await usFetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`)
    } catch (error) {
      logger.error('Error fetching data from NASA API', error)
      throw error
    }

    // Validate with zod
    logger.info(`Validating ${kvForCache} data`)
    try {
      nasaImg = NasaImgSchema.parse(unvalidated)
    } catch (error) {
      logger.error('Error validating data', error)
      throw error
    }

    // Store in storage
    try {
      logger.info(`Storing ${kvForCache} in storage`)
      // await storage.setItem(kvForCache, nasaImg)
    } catch (error) {
      logger.error('Error storing data', error)
      throw error
    }
    return { message: 'Success fetching iotd', status: 200, nasaImg }
  } catch (error: any) {
    return { message: `Error fetching iotd: ${error.message}`, status: 500 }
  }
})
