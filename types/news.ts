import { z } from 'zod'

const MediaSchema = z.object({
  src: z.string(),
  alt: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().optional()
})

const NewsScrapedSchema = z.object({
  title: z.string(),
  link: z.string(),
  body: z.string(),
  category: z.string(),
  images: z.array(MediaSchema).nullable(),
  videos: z.array(MediaSchema).nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export const NewsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  categoryId: z.number().optional(),
  original: z.object({}),
  summary: z.object({}).optional(),
  published: z.date().optional(),
  author: z.object({
    name: z.string(),
    link: z.string().optional(),
    image: z.string().optional()
  }),
  images: z.array(MediaSchema).optional()
})

export const NewsEmbeddingSchema = z.object({
  id: z.number(),
  vector: z.array(z.number()),
  news_id: z.number().optional(),
  created_at: z.string().nullable()
})

export type NewsType = z.infer<typeof NewsSchema>
export type MediaType = z.infer<typeof MediaSchema>
export type NewsEmbeddingType = z.infer<typeof NewsEmbeddingSchema>
export type NewsScrapedType = z.infer<typeof NewsScrapedSchema>
