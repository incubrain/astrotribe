// server/api/__sitemap__/blog.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const entries: any[] = []
  const strapiURL = 'http://localhost:1337'

  // Always add static category pages regardless of Strapi status
  const categories = [
    'all',
    'people-of-space',
    'space-exploration',
    'dark-sky-conservation',
    'sustainable-development',
  ]
  categories.forEach((category) => {
    entries.push({
      loc: `/blog/category-${category}/page-1`,
      lastmod: new Date().toISOString(),
      _sitemap: 'blog-categories',
    })
  })

  try {
    // Try to fetch articles from Strapi
    const response = await fetch(`${strapiURL}/api/articles`, {
      headers: {
        Accept: 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.warn(`[sitemap] Strapi returned ${response.status}: ${response.statusText}`)
      return entries // Return just the category pages
    }

    const data = await response.json()

    // Add articles if available
    if (data?.data && Array.isArray(data.data)) {
      data.data.forEach((article: any) => {
        if (article?.attributes?.slug) {
          entries.push({
            loc: `/blog/${article.attributes.slug}`,
            lastmod: article.attributes.updatedAt || new Date().toISOString(),
            _sitemap: 'blog',
          })
        }
      })
    }
  } catch (error) {
    // Log error but don't crash
    console.warn(
      '[sitemap] Failed to fetch articles from Strapi:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    // Still return the category pages we created
    return entries
  }

  return entries
})
