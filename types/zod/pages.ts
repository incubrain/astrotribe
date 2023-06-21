import { z } from 'zod'

export const PageValidation = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  slug: z.string(),
  children: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        icon: z.string(),
        slug: z.string()
      })
    )
    .optional()
})
