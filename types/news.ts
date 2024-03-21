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
  featured_image: z.string(),
  featured_video: MediaSchema.nullable(),
  author: AuthorSchema.nullable(),
  published_at: z.string(),
  updated_at: z.string().optional()
})

const NewsCardScrapedSchema = z.object({
  published_at: z.string().optional(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  source: z.string(),
  featured_image: z.string()
})

export const NewsCardSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  source: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  published_at: z.string().nullable(),
  description: z.string().nullable(),
  featured_image: z.string().nullable()
})

export const NewsArticleSchema = NewsCardSchema.extend({
  author: z.string(),
  body: z.string(),
  images: z.array(MediaSchema)
})

export const NewsEmbeddingSchema = z.object({
  id: z.number(),
  vector: z.array(z.number()),
  news_id: z.number().optional(),
  created_at: z.string().nullable()
})
export type NewsCategoryT = 'isro' | 'nasa' | 'ula' | 'esa' | 'jaxa' | 'cnsa' | 'roscosmos' | 'csa'
export type NewsCardT = z.infer<typeof NewsCardSchema>
export type NewsCardScrapedT = z.infer<typeof NewsCardScrapedSchema>
export type NewsArticleType = z.infer<typeof NewsArticleSchema>
export type MediaType = z.infer<typeof MediaSchema>
export type NewsEmbeddingType = z.infer<typeof NewsEmbeddingSchema>
export type NewsScrapedType = z.infer<typeof NewsScrapedSchema>
