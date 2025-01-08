// server/middleware/error.ts
import { createCentralisedLogger } from '@ib/logger'
import { useRuntimeConfig } from 'nuxt/app'

export default defineEventHandler((event) => {
  const env = useRuntimeConfig().public
  const logger = createCentralisedLogger(env.serviceName)
  logger.setDomain('server')

  // Add error handler
  event.context.onerror = (error) => {
    logger.error(`Middleware error: ${error.message}`, {
      error,
      url: event.path,
      method: event.method,
      headers: event.headers,
      query: event.context.params,
    })
  }
})
