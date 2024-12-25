// utils/server-logger.ts
import type { Service, CentralizedLogger, ServiceToDomain } from '@ib/logger'
import { H3Event, createError, getRequestHeaders, getQuery } from 'h3'

// First, augment H3Event context to include our logger
declare module 'h3' {
  interface H3EventContext {
    logger: CentralizedLogger<Service>
  }
}

export function useServerLogger(domain: ServiceToDomain[Service]) {
  const event = useEvent()
  const logger = event.context.logger

  if (!logger) {
    throw new Error('Logger not found in event context')
  }

  logger.setDomain(domain)

  const getEventMeta = () => ({
    path: event.path,
    method: event.method,
    query: getQuery(event),
    headers: getRequestHeaders(event),
  })

  return {
    error: (msg: string, meta?: any) => {
      const eventMeta = getEventMeta()
      logger.error(msg, { ...meta, event: eventMeta })
      throw createError({
        statusCode: meta?.statusCode || 500,
        statusMessage: meta?.statusMessage || msg,
        message: meta?.error?.message || msg,
      })
    },

    warn: (msg: string, meta?: any) => {
      logger.warn(msg, { ...meta, event: getEventMeta() })
    },

    info: (msg: string, meta?: any) => {
      logger.info(msg, { ...meta, event: getEventMeta() })
    },

    setDomain(newDomain: ServiceToDomain[Service]) {
      logger.setDomain(newDomain)
    },

    async handle<T>(operation: () => Promise<T>) {
      try {
        return await operation()
      } catch (error: any) {
        this.error('Operation failed', {
          error,
          statusCode: error.statusCode || 500,
          statusMessage: error.statusMessage || 'Operation failed',
        })
      }
    },

    async handleQuery<T>(queryFn: () => Promise<{ data: T; error: any }>) {
      return this.handle(async () => {
        const { data, error } = await queryFn()
        if (error: any) {
          this.error('Query failed', {
            error,
            statusCode: error.code === '22P02' ? 400 : 500,
            statusMessage: 'Database query failed',
            context: { code: error.code, message: error.message, hint: error.hint },
          })
        }
        return { data }
      })
    },
  }
}
