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
  author: z.string().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

export const NewsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  categoryId: z.number().optional()
})

export const NewsEmbeddingSchema = z.object({
  id: z.number(),
  vector: z.array(z.number()),
  news_id: z.number().optional(),
  created_at: z.string().nullable()
})

export type News = z.infer<typeof NewsSchema>
export type Media = z.infer<typeof MediaSchema>
export type NewsEmbedding = z.infer<typeof NewsEmbeddingSchema>
export type NewsScraped = z.infer<typeof NewsScrapedSchema>