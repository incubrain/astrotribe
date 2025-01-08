// server/api/log-pipe.post.ts
import { createCentralizedLogger } from '@ib/logger'
import { defineEventHandler, readBody, createError, type H3Event } from 'h3'

// Initialize logger for client errors
const logger = createCentralizedLogger('client')

export interface ClientErrorPayload {
  level: 'error' | 'warn'
  message: string
  metadata?: {
    error?: Error
    context?: string
    component?: string
    [key: string]: any
  }
}

export async function pipeClientError(payload: ClientErrorPayload, event: H3Event) {
  const { level, message, metadata = {} } = payload

  // Enrich metadata with request info
  const enrichedMetadata = {
    ...metadata,
    userAgent: event.headers.get('user-agent'),
    ip: event.headers.get('x-forwarded-for') || event.headers.get('x-real-ip'),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    // Add any correlation IDs or request context
    requestId: event.headers.get('x-request-id'),
    correlationId: event.headers.get('x-correlation-id'),
  }

  // Use our existing logger
  if (level === 'error') {
    await logger.error(message, enrichedMetadata)
  } else {
    await logger.warn(message, enrichedMetadata)
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { level, message, metadata } = body

  // Only accept error and warning logs
  if (!['error', 'warn'].includes(level)) {
    return { success: false, message: 'Only error and warning logs are accepted' }
  }

  try {
    await pipeClientError({ level, message, metadata }, event)
    return { success: true }
  } catch (error: any) {
    console.error('Failed to process client log:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process log',
    })
  }
})
