// composables/useLogger.ts
import { consola } from 'consola'

export interface LogMetadata {
  error?: Error
  context?: string
  component?: string
  [key: string]: any
}

export interface LogMessage {
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  metadata?: LogMetadata
}

export function useLogger(tag?: string) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const prefix = tag ? `[${tag}]` : ''

  const formatMessage = (message: string) => {
    return tag ? `${prefix} ${message}` : message
  }

  const sendToServer = async (level: 'error' | 'warn', message: string, metadata?: LogMetadata) => {
    try {
      await $fetch('/api/log-pipe', {
        method: 'POST',
        body: {
          level,
          message: formatMessage(message),
          metadata: {
            ...metadata,
            tag,
            app: config.public.appName || 'unknown',
            version: config.public.version || 'unknown',
            route: route.path,
            userAgent: window.navigator.userAgent,
            timestamp: Date.now(),
          },
        },
      })
    } catch (err) {
      // If we can't send to server, at least log locally
      consola.error('Failed to send log to server:', err)
    }
  }

  const logger = {
    error(message: string, metadata?: LogMetadata) {
      consola.error(formatMessage(message), metadata)
      if (import.meta.client) {
        sendToServer('error', message, metadata)
      }
    },

    warn(message: string, metadata?: LogMetadata) {
      consola.warn(formatMessage(message), metadata)
      if (import.meta.client) {
        sendToServer('warn', message, metadata)
      }
    },

    info(message: string, metadata?: LogMetadata) {
      consola.info(formatMessage(message), metadata)
    },

    debug(message: string, metadata?: LogMetadata) {
      if (config.public.debug) {
        consola.debug(formatMessage(message), metadata)
      }
    },

    // Helper for handling errors in async operations
    async handleAsyncError<T>(promise: Promise<T>, context: string): Promise<T | undefined> {
      try {
        return await promise
      } catch (error) {
        logger.error(`Error in ${context}`, { error })
        return undefined
      }
    },

    // Helper for error boundaries and component errors
    handleComponentError(error: unknown, component?: string, info?: string) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      logger.error('Component error', {
        error: errorObj,
        component,
        info,
        stack: errorObj.stack,
      })
    },
  }

  return logger
}
