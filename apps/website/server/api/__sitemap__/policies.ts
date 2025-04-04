// server/api/__sitemap__/policies.ts
import { defineEventHandler } from 'h3'
import { getPagesBySitemap } from '#shared/constants'

export default defineEventHandler(async () => {
  const policyPages = getPagesBySitemap('policies')

  return policyPages.map((page) => ({
    loc: page.path,
    lastmod: page.lastModified || new Date().toISOString(),
    priority: page.priority,
    _sitemap: 'policies',
  }))
})
