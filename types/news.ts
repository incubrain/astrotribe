import { z } from 'zod'

const MediaSchema = z.object({
  src: z.string(),
  alt: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().optional()
})

const AuthorSchema = z.object({
  name: z.string(),
  url: z.string().nullable(),
  image: MediaSchema.nullable()
})

const NewsScrapedSchema = z.object({
  title: z.string(),
  url: z.string(),
  body: z.string(),
  category: z.string(),
  featured_image: MediaSchema.nullable(),
  featured_video: MediaSchema.nullable(),
  author: AuthorSchema.nullable(),
  created_at: z.string(),
  updated_at: z.string().optional()
})

export const NewsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  url: z.string(),
  category_id: z.number().optional()
})

export const NewsFullSchema = NewsSchema.extend({
  author: AuthorSchema.nullable(),
  raw: z.object({
    title: z.string(),
    body: z.string()
  }),
  featured_image: MediaSchema.nullable()
})

export const NewsEmbeddingSchema = z.object({
  id: z.number(),
  vector: z.array(z.number()),
  news_id: z.number().optional(),
  created_at: z.string().nullable()
})

export type NewsType = z.infer<typeof NewsSchema>
export type NewsFullType = z.infer<typeof NewsFullSchema>
export type MediaType = z.infer<typeof MediaSchema>
export type NewsEmbeddingType = z.infer<typeof NewsEmbeddingSchema>
export type NewsScrapedType = z.infer<typeof NewsScrapedSchema>
