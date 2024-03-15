import { z } from 'zod'

export const titleSchema = z.object({
  label: z.string().optional(),
  main: z.string(),
  subtitle: z.string().optional()
})

export const faqSchema = z.object({
  label: z.string(),
  description: z.string()
})

export const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional()
})

export type ImageT = z.infer<typeof imageSchema>
export type TitleT = z.infer<typeof titleSchema>
export type FaqType = z.infer<typeof faqSchema>
