import { z } from 'zod'

const SummarySchema = z
  .object({
    id: z.number().optional(),
    level: z.string(),
    content: z.string(),
    createdAt: z.string().nullable(),
    newsId: z.number().optional()
  })
  .nullable()

export type Summary = z.infer<typeof SummarySchema>
