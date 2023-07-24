import { z } from 'zod'

export const PostSchema = z.object({
  id: z.number(),
  created_at: z.string().nullable(),
  user_id: z.string().nullable(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  image: z.string().nullable(),
  status_id: z.number()
})

// make posts extendable

export type Post = z.infer<typeof PostSchema>
