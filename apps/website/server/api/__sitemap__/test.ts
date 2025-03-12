// server/api/__sitemap__/test.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    status: 'ok',
    config: { cmsURL: config.public.cmsURL, siteURL: config.public.siteRLL },
    testURL: `${config.public.cmsURL}/api/articles`,
    timestamp: new Date().toISOString(),
  }
})
