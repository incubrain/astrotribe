import { z } from 'zod'

const SummariesSchema = z
  .object({
    beginner: z.array(z.string()),
    intermediate: z.array(z.string()),
    expert: z.array(z.string())
  })
  .nullable()

const MediaSchema = z.object({
  src: z.string(),
  alt: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().optional()
})

const TagsSchema = z.array(
  z.object({
    id: z.number().optional(),
    name: z.string()
  })
)

const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string()
})

const AuthorSchema = z.object({
  name: z.string().nullable(),
  link: z.string().nullable(),
  image: z.string().nullable()
})

const RawContentSchema = z.object({
  title: z.string(),
  body: z.string()
})

const NewsScrapedSchema = z.object({
  title: z.string(),
  link: z.string(),
  body: z.string(),
  category: z.string(),
  images: z.array(MediaSchema).nullable(),
  videos: z.array(MediaSchema).nullable(),
  author: AuthorSchema.nullable(),
  tags: TagsSchema.nullable(),
  created: z.string().nullable(),
  updated: z.string().nullable()
})

export const NewsGenerateSchema = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  category: CategorySchema.optional(),
  embedding: z.string().nullable(),
  tags: TagsSchema.optional(),
  author: AuthorSchema.nullable(),
  raw: RawContentSchema,
  media: z.array(MediaSchema).optional(),
  summary: SummariesSchema,
  oldSummaries: z.array(SummariesSchema).optional()
})

export const NewsSchema = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  category: CategorySchema.optional(),
  embedding: z.string().nullable(),
  tags: TagsSchema.optional(),
  author: AuthorSchema.nullable(),
  raw: RawContentSchema.optional(),
  media: z.array(MediaSchema).optional(),
  summary: SummariesSchema,
  oldSummaries: z.array(SummariesSchema).optional()
})

export const NewsVectorsSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  created_at: z.string().nullable(),
  embedding: z.string().nullable()
})

// we use the cosign of vectors to check if articles are about the same thing
// assign a wieght to more trusted sources, and use that to determine which article to keep

// how much does 1 article take in storage est.
// have ability to store previous summaries to improve prompt engineering over time

export type News = z.infer<typeof NewsSchema>
export type Media = z.infer<typeof MediaSchema>
export type NewsVectors = z.infer<typeof NewsVectorsSchema>
export type NewsScraped = z.infer<typeof NewsScrapedSchema>
export type NewsGenerate = z.infer<typeof NewsGenerateSchema>
