import { z } from 'zod'

export const PageSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.string(),
  slug: z.string(),
  children: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
        icon: z.string(),
        slug: z.string()
      })
    )
    .optional()
})

export type Page = z.infer<typeof PageSchema>
