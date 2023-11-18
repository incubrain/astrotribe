import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.number(),
  created_at: z.string().optional(),
  name: z.string(),
  body: z.string().optional()
})

export type RoleType = z.infer<typeof RoleSchema>
