import { z } from 'zod'
import { datetimeOffset } from '../formatter'

// todo:med:easy - move the schema to the supabase folder so it lives near the actual structure
// todo:low:hard - validate the schema against the database types to ensure they match, maybe a script

const vectorSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
})

export const embeddingSchema = z.object({
  id: z.number().gt(0, 'tag:id Id is required').optional(),
  created_at: datetimeOffset('tag:created_at - Incorrect Date Format').optional,
  vector: vectorSchema,
  type: z.string().optional()
})

export const newsEmbeddingSchema = z.object({
  id: z.number().gt(0, 'tag:id Id is required').optional(),
  embedding_id: z.number().gt(0, 'Embedding is required'),
  news_id: z.number().gt(0, 'News is required')
})

export const tagSchema = z.object({
  id: z.number().gt(0, 'Id is required').optional(),
  created_at: datetimeOffset('tag:created_at - Incorrect Date Format').optional,
  updated_at: datetimeOffset('tag:updated_at - Incorrect Date Format').optional,
  body: z.string().min(1, 'Body is required').optional(),
  title: z.string().min(1, 'Title is required')
})

export const newsTagSchema = z.object({
  id: z.number().gt(0, 'Id is required').optional(),
  news_id: z.number().gt(0, 'News is required'),
  tag_id: z.number().gt(0, 'Tag is required')
})

export const categorySchema = z.object({
  id: z.number().gt(0, 'Id is required').optional(),
  created_at: datetimeOffset('category:created_at - Incorrect Date Format').optional,
  body: z.string().min(1, 'Body is required').optional(),
  title: z.string().min(1, 'Title is required')
})

export const newsSchema = z.object({
  id: z.number().gt(0, 'Id is required').optional(),
  created_at: datetimeOffset('news:created_at - Incorrect Date Format').optional,
  updated_at: datetimeOffset('news:updated_at - Incorrect Date Format').optional,
  category_id: z.number().gt(0, 'Category is required'),
  body: z.string().min(1, 'Body is required').optional(),
  has_summary: z.boolean().default(false),
  author: z.string().min(1, 'Author is required').nullish(),
  description: z.string().min(1, 'Description is required').nullish(),
  featured_image: z.string().url().nullish(),
  published_at: datetimeOffset('news:published_at - Incorrect Date Format').nullish,
  source: z.string().min(1, 'Source is required'),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url()
})

export type NewsEmbeddingType = z.infer<typeof newsEmbeddingSchema>
export type CategoryType = z.infer<typeof categorySchema>
export type TagType = z.infer<typeof tagSchema>
export type NewsTagType = z.infer<typeof newsTagSchema>
export type NewsType = z.infer<typeof newsSchema>

export class Category {
  id: number
  title: string
  body: string | null
  created_at: Date

  constructor(data: any) {
    this.id = data.id
    this.title = data.title
    this.body = data.body
    this.created_at = data.created_at
  }
}

export class Tag {
  id: number
  title: string
  body: string | null
  created_at: Date
  constructor(data: any) {
    this.id = data.id
    this.title = data.title
    this.body = data.body
    this.created_at = data.created_at
  }
}

export class News {
  id: number
  title: string
  body: string | null
  category_id: number
  // category: Category
  // tags: Tag[]
  author: string | null
  source: string
  published_at: Date | null
  created_at: Date
  updated_at: Date | null
  description: string | null
  featured_image: string | null
  has_summary: boolean
  url: string
  constructor(data: any) {
    this.id = data.id
    this.title = data.title
    this.body = data.body
    this.category_id = data.category_id
    // this.category = new Category(data.category_id)
    // this.tags = data.tags.map((tag: any) => new Tag(tag))
    this.author = data.author
    this.source = data.source
    this.published_at = data.published_at
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.description = data.description
    this.featured_image = data.featured_image
    this.has_summary = data.has_summary
    this.url = data.url
  }
}
