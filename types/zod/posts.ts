import { z } from 'zod'

export const PostValidation = z.object({
  id: z.number(),
  created_at: z.string().nullable(),
  user_id: z.string().nullable(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  image: z.string().nullable(),
  status_id: z.number()
})

// make posts extendable
export const NewsValidation = z.object({
  title: z.string().nullable(),
  body: z.string().nullable(),
  author: z.string().nullable(),
  published: z.string().nullable(),
  category: z.string().nullable()
})
