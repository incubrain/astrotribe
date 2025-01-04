// server/api/__sitemap__/test.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    status: 'ok',
    config: {
      strapiUrl: config.public.strapiURL,
      siteUrl: config.public.siteURL,
    },
    testUrl: `${config.public.strapiURL}/api/articles`,
    timestamp: new Date().toISOString(),
  }
})
