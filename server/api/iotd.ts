import { Buffer } from 'buffer'
import type { StorageValue } from 'unstorage'
import Jimp from 'jimp'
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

export default cachedEventHandler(
  async (event) => {
    const date = new Date().toISOString().split('T')[0]
    const cacheKey = `image:${date}`

    let nasaImg = await useStorage().getItem(cacheKey)

    if (!nasaImg) {
      const unvalidated = await $fetch(
        'https://api.nasa.gov/planetary/apod?api_key=qVu1erjdjYJLfLLALZyIz3EfYxOerf29waltn3PM'
      )
      const data: NasaImg = imageObject.parse(unvalidated)
      nasaImg = data
      // Save the image data to the cache
      await useStorage().setItem(cacheKey, nasaImg)
    }

    return nasaImg
  },
  {
    swr: true,
    maxAge: 60 * 60
  }
)
