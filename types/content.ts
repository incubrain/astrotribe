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

export type Title = z.infer<typeof titleSchema>
export type Faq = z.infer<typeof faqSchema>
