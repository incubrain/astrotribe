// server/api/__sitemap__/blog.ts
import { defineEventHandler } from 'h3'
import { getPagesBySitemap } from '#shared/constants'

export default defineEventHandler(async (event) => {
  const blogPages = getPagesBySitemap('blog')

  // Start with the static blog pages
  const entries = blogPages.map((page) => ({
    loc: page.path,
    lastmod: page.lastModified || new Date().toISOString(),
    priority: page.priority,
    _sitemap: 'blog',
  }))

  try {
    // Query content directly with Nuxt Content for dynamic blog articles
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
  } catch (error: any) {
    console.warn(
      '[sitemap] Failed to fetch articles:',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }

  return entries
})
