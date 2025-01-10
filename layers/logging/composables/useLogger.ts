// composables/useLogger.ts
import consola from 'consola'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'

interface LogMetadata {
  error?: Error
  context?: string
  component?: string
  severity?: SeverityLevel
  [key: string]: any
}

interface ClientErrorPayload {
  level: LogLevel
  message: string
  service: string
  severity: SeverityLevel
  metadata?: Record<string, any>
}

// Default severity mappings
const DEFAULT_SEVERITY_MAP: Record<LogLevel, SeverityLevel> = {
  error: 'critical',
  warn: 'high',
  info: 'medium',
  debug: 'low',
}

export function useLogger(service: string = 'client') {
  const config = useRuntimeConfig()

  const sendLogToServer = async (payload: ClientErrorPayload) => {
    try {
      await $fetch('/api/log-pipe', {
        method: 'POST',
        body: payload,
      })
    } catch (error) {
      consola.error('Failed to send log to server:', error)
    }
  }

  const createLog = (level: LogLevel, message: string, metadata?: LogMetadata) => {
    // Ensure we have a severity level
    const severity = metadata?.severity || DEFAULT_SEVERITY_MAP[level]

    const enrichedMetadata = {
      ...metadata,
      environment: config.public.environment,
    }

    // Create the actual payload that matches the server's expectations
    const payload = {
      level,
      message,
      service,
      severity,
      metadata: enrichedMetadata,
    }

    return payload
  }

  const error = (message: string, metadata?: LogMetadata) => {
    const log = createLog('error', message, metadata)
    consola.error(message, log.metadata)
    sendLogToServer(log)
    return log
  }

  const warn = (message: string, metadata?: LogMetadata) => {
    const log = createLog('warn', message, metadata)
    consola.warn(message, log.metadata)
    sendLogToServer(log)
    return log
  }

  const info = (message: string, metadata?: LogMetadata) => {
    const log = createLog('info', message, metadata)
    consola.info(message, log.metadata)
    return log
  }

  const debug = (message: string, metadata?: LogMetadata) => {
    const log = createLog('debug', message, metadata)
    consola.debug(message, log.metadata)
    return log
  }

  return {
    error,
    warn,
    info,
    debug,
    createLog,
  }
}

// Add type exports for global use
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $logger: ReturnType<typeof useLogger>
  }
}
