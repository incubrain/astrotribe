// server/plugins/error-handler.ts
import { useLoggerAsync, ErrorType } from '@ib/logger'
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
    const isDev = process.env.NODE_ENV === 'development'
    const logger = await useLoggerAsync('nitro:error')

    // Extract API response from error.data if it exists, or create a new one
    const apiResponse: ApiResponse = (error.data as ApiResponse) || {
      error: {
        code: error.statusCode === 404 ? ErrorType.SERVER_ERROR : ErrorType.SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        details: isDev
          ? {
              name: error.name,
              cause: error.cause,
              stack: error.stack,
            }
          : undefined,
      },
      status: error.statusCode || 500,
    }

    if (event) {
      // Log the error with full context
      logger.error(`[${event.path}] ${event.method} Error:`, {
        code: apiResponse.error?.code,
        statusCode: error.statusCode,
        message: error.message,
        name: error.name,
        cause: isDev ? error.cause : undefined,
        stack: isDev ? error.stack : undefined,
      })

      // Set response
      event.node.res.statusCode = apiResponse.status
      event.node.res.setHeader('Content-Type', 'application/json')

      // Send sanitized response
      const safeResponse = {
        ...apiResponse,
        error: isDev
          ? apiResponse.error
          : {
              code: apiResponse.error?.code,
              message: apiResponse.error?.message,
            },
      }

      event.node.res.end(JSON.stringify(safeResponse))
    } else {
      // Log error even if no event context
      logger.error('Unhandled Server Error:', {
        code: apiResponse.error?.code,
        statusCode: error.statusCode,
        message: error.message,
        name: error.name,
        cause: isDev ? error.cause : undefined,
        stack: isDev ? error.stack : undefined,
      })
    }
  })
})
