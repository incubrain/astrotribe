import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const entries: any[] = []

  const categories = [
    'all',
    'people-of-space',
    'space-exploration',
    'dark-sky-conservation',
    'sustainable-development',
  ]

  // Add category pages
  categories.forEach((category) => {
    entries.push({
      loc: `/blog/category/${category}`,
      lastmod: new Date().toISOString(),
      _sitemap: 'blog-categories',
    })
  })

  try {
    // Query content directly with Nuxt Content
    const articles = await queryCollection(event, 'blog').where('draft', '=', false).all()

    // Add articles
    if (articles && articles.length) {
      articles.forEach((article: any) => {
        if (article.path) {
          entries.push({
            loc: article.path,
            lastmod: article.updatedAt || article.date || new Date().toISOString(),
            _sitemap: 'blog',
          })
        }
      })
    }
  } catch (error) {
    // Log error but don't crash
    console.warn(
      '[sitemap] Failed to fetch articles:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    // Still return the category pages we created
    return entries
  }

  return entries
})
