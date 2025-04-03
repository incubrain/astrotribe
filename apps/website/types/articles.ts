import { z } from 'zod'

export const articleStatusSchema = z.enum(['published', 'draft', 'unpublished', 'archived'])
export const dateSchema = z.string().datetime()

const isUUID = (value: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(value)
}

// Custom Zod validation
const UUIDSchema = z.string().refine(isUUID, {
  message: 'String must be a valid UUID',
})

// ARTICLE CATEGORIES
export const articleCategorySchema = z.enum([
  'all',
  'people-of-space',
  'space-exploration',
  'dark-sky-conservation',
  'sustainable-development',
  'research',
])
export type ArticleCategoriesT = z.infer<typeof articleCategorySchema>
export const CATEGORIES: ArticleCategoriesT[] = [
  'all',
  'people-of-space',
  'space-exploration',
  'dark-sky-conservation',
  'sustainable-development',
  'research',
]

// ARTICLE TAGS
export const articleTagSchema = z.enum([
  'solar system',
  'black holes',
  'galaxies',
  'nebulae',
  'stars',
  'planets',
  'moons',
  'comets',
  'asteroids',
  'telescopes',
  'radio telescopes',
  'space probes',
  'exoplanets',
  'dark matter',
  'dark energy',
  'astrophotography',
  'space missions',
  'big bang',
  'supernovae',
  'astronomy events',
  'astrobiology',
  'astrochemistry',
  'cosmic rays',
  'space weather',
  'astronomy history',
  'astrology',
  'alien life',
  'space travel',
  'gravitational waves',
  'interstellar medium',
  'orion',
  'hubble space telescope',
  'james webb space telescope',
  'nasa',
  'esa',
  'spacex',
  'milky way',
  'andromeda',
  'event horizon telescope',
  'astroinformatics',
  'multiverse',
  'space station',
  'astronomy software',
  'binary stars',
  'mars rover',
  'blue moon',
  'solar eclipse',
  'lunar eclipse',
  'satellites',
  'international space station',
  'sky map apps',
  'astro tourism',
])
export type ArticleTagsT = z.infer<typeof articleTagSchema>
export const TAGS: ArticleTagsT[] = [
  'solar system',
  'black holes',
  'galaxies',
  'nebulae',
  'stars',
  'planets',
  'moons',
  'comets',
  'asteroids',
  'telescopes',
  'radio telescopes',
  'space probes',
  'exoplanets',
  'dark matter',
  'dark energy',
  'astrophotography',
  'space missions',
  'big bang',
  'supernovae',
  'astronomy events',
  'astrobiology',
  'astrochemistry',
  'cosmic rays',
  'space weather',
  'astronomy history',
  'astrology',
  'alien life',
  'space travel',
  'gravitational waves',
  'interstellar medium',
  'orion',
  'hubble space telescope',
  'james webb space telescope',
  'nasa',
  'esa',
  'spacex',
  'milky way',
  'andromeda',
  'event horizon telescope',
  'astroinformatics',
  'multiverse',
  'space station',
  'astronomy software',
  'binary stars',
  'mars rover',
  'blue moon',
  'solar eclipse',
  'lunar eclipse',
  'satellites',
  'international space station',
  'sky map apps',
  'astro tourism',
]

// ARTICLE CARD
export const articleCardSchema = z.object({
  id: UUIDSchema,
  authorIds: z.array(z.number()),
  title: z
    .string()
    .min(2, 'Title must be at least 1 char long')
    .max(70, 'Title has a max length of 70 char'),
  description: z
    .string()
    .min(2, 'Description must be at least 160 char long')
    .max(280, 'Description has a max length of 280 char'),
  category: articleCategorySchema,
  keywords: z.object({
    primary: z.string(),
    secondary: z.array(z.string()).optional(),
  }),
  tags: z
    .array(articleTagSchema)
    .min(1, 'Minimum of 1 tag allowed')
    .max(3, 'Maximum of 3 tags allowed'),
  status: articleStatusSchema,
  featured_image: z.string(),
  publishedAt: dateSchema,
  updatedAt: dateSchema,
  isSSR: z.boolean().optional(),
  _path: z.string(),
})
export type ArticleCardT = z.infer<typeof articleCardSchema>
export const ARTICLE_CARD_PROPERTIES = [
  'id',
  'authorIds',
  'title',
  'description',
  'category',
  'tags',
  'status',
  'keywords',
  'featured_image',
  'publishedAt',
  'updatedAt',
  '_path',
]

const authorSchema = z.object({
  name: z.object({
    given: z.string(),
    surname: z.string(),
    full: z.string(),
    title: z.string().optional(),
  }),
  avatar: z.string(),
  bio: z.object({
    short: z.string(),
    full: z.string(),
  }),
  socials: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
  }),
  sponsorLink: z.string().optional(),
})

export type AuthorT = z.infer<typeof authorSchema>

// ARTICLE FULL ARTICLE
export const articleFullSchema = articleCardSchema.extend({
  body: z.object({}).passthrough(), // passthrough allows any structure within the object
  version: z.number(),
  _id: z.string(),
})
export type ArticleFullT = z.infer<typeof articleFullSchema>
export const ARTICLE_FULL_PROPERTIES = [...ARTICLE_CARD_PROPERTIES, 'body', '_id', 'version']
