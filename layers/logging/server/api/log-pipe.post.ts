// server/api/log-pipe.post.ts
import { defineEventHandler, readBody, createError, getRequestIP } from 'h3'
import { logger } from '../utils/logger'

interface LogPayload {
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  service: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  metadata?: Record<string, any>
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LogPayload>(event)

    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body',
      })
    }

    const { level, message, service, severity, metadata = {} } = body

    // Validate required fields
    if (!level || !message || !service || !severity) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      })
    }

    // Only accept error and warning logs
    if (!['error', 'warn'].includes(level)) {
      return {
        success: false,
        message: 'Only error and warning logs are accepted',
      }
    }

    const enrichedMetadata = {
      ...metadata,
      created_at: new Date().toISOString(),
      userAgent: event.headers.get('user-agent'),
      ip: getRequestIP(event),
      requestId: event.headers.get('x-request-id'),
      correlationId: event.headers.get('x-correlation-id'),
      source: 'client',
      severity, // Ensure severity is included in metadata
    }

    // Forward to the actual logging service
    if (level === 'error') {
      await logger.error(message, enrichedMetadata)
    } else {
      await logger.warn(message, enrichedMetadata)
    }

    return {
      success: true,
      data: {
        level,
        service,
        severity,
        created_at: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('Failed to process client log:', error)

    if (error.statusCode === 400) {
      throw error
    }

    return {
      success: false,
      error: 'Internal server error while processing log',
    }
  }
})
