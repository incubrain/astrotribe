// server/api/__sitemap__/test.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    status: 'ok',
    config: {
      strapiURL: config.public.strapiURL,
      siteURL: config.public.siteRLL,
    },
    testURL: `${config.public.strapiURL}/api/articles`,
    timestamp: new Date().toISOString(),
  }
})
