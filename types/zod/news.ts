import { z } from 'zod'

const SummariesValidation = z
  .object({
    beginner: z.array(z.string()),
    intermediate: z.array(z.string()),
    expert: z.array(z.string())
  })
  .nullable()

const MediaValidation = z.object({
  src: z.string(),
  alt: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().optional()
})

const TagsValidation = z.array(
  z.object({
    id: z.number().optional(),
    name: z.string()
  })
)

const CategoryValidation = z.object({
  id: z.number().optional(),
  name: z.string()
})

const AuthorValidation = z.object({
  name: z.string().nullable(),
  link: z.string().nullable(),
  image: z.string().nullable()
})

const RawContentValidation = z.object({
  title: z.string(),
  body: z.string()
})

const NewsScrapedValidation = z.object({
  title: z.string(),
  link: z.string(),
  body: z.string(),
  category: z.string(),
  images: z.array(MediaValidation).nullable(),
  videos: z.array(MediaValidation).nullable(),
  author: AuthorValidation.nullable(),
  tags: TagsValidation.nullable(),
  created: z.string().nullable(),
  updated: z.string().nullable()
})

export const NewsGenerateValidation = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  category: CategoryValidation.optional(),
  embedding: z.string().nullable(),
  tags: TagsValidation.optional(),
  author: AuthorValidation.nullable(),
  raw: RawContentValidation,
  media: z.array(MediaValidation).optional(),
  summary: SummariesValidation,
  oldSummaries: z.array(SummariesValidation).optional()
})

export const NewsValidation = z.object({
  id: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  title: z.string(),
  link: z.string(),
  category: CategoryValidation.optional(),
  embedding: z.string().nullable(),
  tags: TagsValidation.optional(),
  author: AuthorValidation.nullable(),
  raw: RawContentValidation.optional(),
  media: z.array(MediaValidation).optional(),
  summary: SummariesValidation,
  oldSummaries: z.array(SummariesValidation).optional()
})

export const NewsVectorsValidation = z.object({
  id: z.number(),
  post_id: z.number(),
  created_at: z.string().nullable(),
  embedding: z.string().nullable()
})

// we use the cosign of vectors to check if articles are about the same thing
// assign a wieght to more trusted sources, and use that to determine which article to keep

// how much does 1 article take in storage est.
// have ability to store previous summaries to improve prompt engineering over time

export type News = z.infer<typeof NewsValidation>
export type Media = z.infer<typeof MediaValidation>
export type NewsVectors = z.infer<typeof NewsVectorsValidation>
export type NewsScraped = z.infer<typeof NewsScrapedValidation>
export type NewsGenerate = z.infer<typeof NewsGenerateValidation>
