import { z } from 'zod'

const imageObject = z.object({
    title: z.string(),
    explanation: z.string(),
    date: z.string(),
    url: z.string(),
    hdurl: z.string(),
    media_type: z.string(),
    copyright: z.string(),
    service_version: z.string(),
})

type NasaImg = z.infer<typeof imageObject>

let nasaImg: NasaImg | undefined = undefined

export default defineEventHandler(async (event) => {
    if (nasaImg !== undefined) return { nasaImg }
    console.log('should continue')

    const unvalidated = await $fetch(
        'https://api.nasa.gov/planetary/apod?api_key=qVu1erjdjYJLfLLALZyIz3EfYxOerf29waltn3PM'
    )

    const data: NasaImg = imageObject.parse(unvalidated)
    nasaImg = data
    return {
        nasaImg,
    }
})
