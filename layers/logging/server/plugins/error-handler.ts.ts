// server/plugins/error-handler.ts
import { getRequestIP, getRequestPath } from 'h3'
import { logger } from '../utils/logger'

const requestTimers = new Map()
const processingErrors = new Set()
let isWarmup = true // Start true, set to false after initial warmup

// Helper to check if we're in warmup/build phase
const isWarmupPhase = (event: any) => {
  // During warmup, these properties are typically undefined/empty
  return !event?.method || !event?.headers || isWarmup
}

export default defineNitroPlugin((nitroApp) => {
  // Add warmup completion hook
  nitroApp.hooks.hook('ready', () => {
    setTimeout(() => {
      isWarmup = false
    }, 1000) // Give a small buffer after ready event
  })

  nitroApp.hooks.hook('request', async (event) => {
    // Skip timing during warmup
    if (isWarmupPhase(event)) {
      return event.handle()
    }

    const path = getRequestPath(event)
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    requestTimers.set(requestId, {
      startTime: Date.now(),
      path,
    })

    try {
      return await event.handle()
    } finally {
      const timing = requestTimers.get(requestId)
      if (timing) {
        const duration = Date.now() - timing.startTime
        requestTimers.delete(requestId)

        if (duration > 1500) {
          await logger.warn('Slow request detected', {
            duration,
            path: timing.path,
            method: event.method,
            requestId,
          })
        }
      }
    }
  })

  nitroApp.hooks.hook('error', async (error, { event }) => {
    // Skip logging during warmup
    if (isWarmupPhase(event)) {
      console.warn('Skipping error log during warmup:', error.message)
      return
    }

    const errorId = `${error.message}:${error.stack}`

    if (processingErrors.has(errorId)) {
      console.warn('Prevented error logging loop:', error.message)
      return
    }

    try {
      processingErrors.add(errorId)

      const path = getRequestPath(event)
      // Skip logging for log endpoint errors to prevent loops
      if (path?.includes('/api/v1/logs') || path?.includes('/api/log-pipe')) {
        return
      }

      // Get headers safely
      let headers = {}
      try {
        headers = event.headers ? Object.fromEntries(event.headers.entries()) : {}
      } catch (e) {
        // Ignore header parsing errors during partial initialization
      }

      await logger.error('Server error', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        request: {
          path,
          method: event.method,
          ip: getRequestIP(event),
          headers,
          query: event?.context?.params,
        },
        severity: 'critical',
        timestamp: new Date().toISOString(),
      })
    } finally {
      processingErrors.delete(errorId)
    }
  })
})
