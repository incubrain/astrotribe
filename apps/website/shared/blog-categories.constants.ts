export const BLOG_CATEGORIES = [
  'all',
  'people-of-space',
  'space-exploration',
  'dark-sky-conservation',
  'sustainable-development',
  'research',
] as const

export type ArticleCategoryT = (typeof BLOG_CATEGORIES)[number]
