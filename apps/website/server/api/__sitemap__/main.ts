// server/api/__sitemap__/main.ts
import { defineEventHandler } from 'h3'
import { getPagesBySitemap } from '#shared/constants'

export default defineEventHandler(async () => {
  const mainPages = getPagesBySitemap('main')

  return mainPages.map((page) => ({
    loc: page.path,
    lastmod: page.lastModified || new Date().toISOString(),
    priority: page.priority,
    _sitemap: 'main',
  }))
})
