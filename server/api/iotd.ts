import { z } from 'zod'

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
  // Create key for KV storage
  let nasaImg: NasaImg | null
  const date = new Date().toISOString().split('T')[0]
  const cacheKey = `nasa-iotd:${date}`

  // Initiate storage redis in prod, fs in dev
  const storage = useStorage('data')

  // Check if item exists in KV storage
  const isItemInStorage = await storage.hasItem(cacheKey)
  if (isItemInStorage) {
    // Get item from KV storage
    nasaImg = await storage.getItem<NasaImg>(cacheKey)!
  } else {
    // Fetch data
    const nasaKey = useRuntimeConfig().NASA_API_KEY
    const unvalidated = await $fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaKey}`)

    // Validate with zod
    const data: NasaImg = imageObject.parse(unvalidated)
    nasaImg = data

    // Store in KV
    await storage.setItem(cacheKey, nasaImg)
  }

  return nasaImg
})
