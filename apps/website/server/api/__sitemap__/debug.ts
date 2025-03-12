// server/api/__sitemap__/debug.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Only enable in development
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const config = useRuntimeConfig()

  try {
    // !todo: update with new blog system
    const response = await $fetch(`${config.public.cmsURL}/api/articles`, {
      params: { pagination: { pageSize: 1 } },
    })

    return {
      status: 'ok',
      strapi: { connection: 'success', sample: response },
      sitemapUrl: `${config.public.siteURL}/sitemap.xml`,
      environment: process.env.NODE_ENV,
    }
  } catch (error: any) {
    return {
      status: 'error',
      error: error.message,
      sitemapUrl: `${config.public.siteURL}/sitemap.xml`,
      environment: process.env.NODE_ENV,
    }
  }
})
