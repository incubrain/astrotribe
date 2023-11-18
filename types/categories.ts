import { z } from 'zod'

const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string()
})

export type CategoryType = z.infer<typeof CategorySchema>
