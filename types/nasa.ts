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

export type NasaImg = z.infer<typeof NasaImgSchema>
