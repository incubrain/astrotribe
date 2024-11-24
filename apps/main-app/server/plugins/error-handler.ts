import { useLoggerAsync, type ErrorType } from '@ib/logger'
import type { H3Error } from 'h3'

interface ApiResponse {
  error?: {
    code: typeof ErrorType
    message: string
    details?: any
  }
  status: number
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', async (error: Error, { event }) => {
    const isDev = useRuntimeConfig().public.nodeEnv === 'development'
    const logger = await useLoggerAsync('nitro:error')

    if (!event || event.node.res.writableEnded || event.node.res.headersSent) {
      logger.warn('Response already sent or no event context available')
      return
    }

    logger.error(`[${event.path}] ${event.method} Error:`, {
      statusCode: 400,
      message: error.message,
      name: error.name,
      cause: isDev ? error.cause : undefined,
      stack: isDev ? error.stack : undefined,
    })
  })
})
