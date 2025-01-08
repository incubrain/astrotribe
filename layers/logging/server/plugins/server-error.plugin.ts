// server/plugins/error-handler.ts
import { createCentralisedLogger } from '@ib/logger'
import { useRuntimeConfig } from 'nuxt/app'

export default defineNitroPlugin((nitroApp) => {
  // Initialize logger
  const env = useRuntimeConfig().public
  const logger = createCentralisedLogger(env.serviceName)
  logger.setDomain('server')

  // Handle all errors
  nitroApp.hooks.hook('error', (error, { event }) => {
    const errorContext = {
      url: event?.path || 'unknown',
      method: event?.method,
      headers: event?.headers,
      query: event?.context?.params,
      body: event?.context?.body,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.statusCode || 500,
      },
      // Add request IDs if available
      requestId: event?.headers?.get('x-request-id'),
      correlationId: event?.headers?.get('x-correlation-id'),
    }

    // Log the error
    logger.error(`Nitro server error: ${error.message}`, errorContext)
  })

  // Optionally handle request completion for performance monitoring
  nitroApp.hooks.hook('request', async (event) => {
    const start = Date.now()

    // Wait for request to complete
    await event.handle()

    const duration = Date.now() - start

    // Log slow requests (e.g., over 1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        url: event.path,
        method: event.method,
        duration,
        headers: event.headers,
        query: event.context.params,
      })
    }
  })

  // Handle unhandled rejections and exceptions
  if (process) {
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection', {
        reason,
        promise,
      })
    })

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        error: {
          message: error.message,
          stack: error.stack,
        },
      })

      // Gracefully shutdown after uncaught exception
      setTimeout(() => {
        process.exit(1)
      }, 1000)
    })
  }
})
