import { z } from 'zod'

const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string()
})

export type Tag = z.infer<typeof TagSchema>
