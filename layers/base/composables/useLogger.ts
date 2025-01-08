// types/logger.ts
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose'

export type LogDomain = 'api' | 'errors' | 'metrics' | 'business-systems' | 'jobs'

export interface LogEntry {
  level: LogLevel
  message: string
  domain: LogDomain
  timestamp: string
  error?: {
    message: string
    stack?: string
    code?: string
  }
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

// composables/useLogger.ts
export function useLogger(domain: LogDomain) {
  const currentDomain = ref<LogDomain>(domain)
  const config = useRuntimeConfig()

  async function sendLogToServer(entry: LogEntry) {
    if (entry.level === 'error' || entry.level === 'warn') {
      try {
        await $fetch('/api/logs', {
          method: 'POST',
          body: entry,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        // Fallback to console if server logging fails
        console.error('Failed to send log to server:', error)
        console[entry.level](entry.message, entry)
      }
    }

    // Always log to console in development
    if (import.meta.dev) {
      console[entry.level](entry.message, entry)
    }
  }

  function createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
  ): LogEntry {
    return {
      level,
      message,
      domain: currentDomain.value,
      timestamp: new Date().toISOString(),
      ...metadata,
      context: {
        env: import.meta.dev ? 'development' : 'production',
        service: 'admin',
        ...(metadata?.context && typeof metadata.context === 'object' ? metadata.context : {}),
      },
    }
  }

  return {
    error: (msg: string, metadata?: Record<string, unknown>) => {
      const entry = createLogEntry('error', msg, metadata)
      void sendLogToServer(entry)
    },

    warn: (msg: string, metadata?: Record<string, unknown>) => {
      const entry = createLogEntry('warn', msg, metadata)
      void sendLogToServer(entry)
    },

    info: (msg: string, metadata?: Record<string, unknown>) => {
      // Only log info in development
      if (import.meta.dev) {
        const entry = createLogEntry('info', msg, metadata)
        console.info(msg, entry)
      }
    },

    setDomain: (newDomain: LogDomain) => {
      currentDomain.value = newDomain
    },

    handleResponse: async <T>(
      operation: () => Promise<T>,
      options: {
        successMessage?: string
        errorMessage?: string
        context?: Record<string, unknown>
      } = {},
    ) => {
      try {
        const result = await operation()
        if (options.successMessage && import.meta.dev) {
          console.info(options.successMessage)
        }
        return result
      } catch (error: any) {
        const errorMessage = options.errorMessage || 'Operation failed'
        void sendLogToServer({
          level: 'error',
          message: errorMessage,
          domain: currentDomain.value,
          timestamp: new Date().toISOString(),
          error,
          context: options.context,
        })
        throw error
      }
    },
  }
}
