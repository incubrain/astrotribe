// server/utils/logger.ts

interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  metadata?: Record<string, any>
  service?: string
  timestamp?: string
}

class HTTPLogger {
  private apiURL: string
  private service: string
  private apiKey: string
  private retryCount: number = 3
  private retryDelay: number = 1000

  constructor() {
    const config = useRuntimeConfig()
    this.apiURL = `${config.public.apiURL}/api/v1/logs/process`
    this.service = 'api'
    this.apiKey = config.apiSecretKey ?? 12345 // Add your API key here
  }

  private async sendLogWithRetry(entry: LogEntry, attempts: number = 0): Promise<void> {
    try {
      const response = await $fetch(this.apiURL, {
        method: 'POST',
        body: {
          ...entry,
          service: this.service,
        },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      return response
    } catch (error: any) {
      // Don't retry if we've hit our limit
      if (attempts >= this.retryCount) {
        // Fall back to console logging if all retries fail
        console[entry.level]('Failed to send log to API after retries:', {
          error: error.message,
          entry,
        })
        return
      }

      // Exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempts)
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Retry with incremented attempt counter
      return this.sendLogWithRetry(entry, attempts + 1)
    }
  }

  private async handleLog(
    level: LogEntry['level'],
    message: string,
    metadata?: Record<string, any>,
  ) {
    const entry = { level, message, metadata }

    try {
      await this.sendLogWithRetry(entry)
    } catch (error) {
      // Last resort fallback to console
      console[level]('Completely failed to send log:', {
        error,
        entry,
      })
    }
  }

  async error(message: string, metadata?: Record<string, any>) {
    await this.handleLog('error', message, metadata)
  }

  async warn(message: string, metadata?: Record<string, any>) {
    await this.handleLog('warn', message, metadata)
  }

  async info(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      await this.handleLog('info', message, metadata)
    }
  }

  async debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      await this.handleLog('debug', message, metadata)
    }
  }
}

export const logger = new HTTPLogger()
