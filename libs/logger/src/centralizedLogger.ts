import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { LogMetadata, LogContext, ErrorLogEntry } from './error-interface'
import { BaseLogger, NodeLogger } from './logger'
import { getEnvironment } from './environment'

export class CentralizedLogger extends NodeLogger {
  private static _instance: CentralizedLogger | null = null
  private supabase: SupabaseClient | null = null
  private metadata: Partial<LogMetadata>

  private constructor(serviceName: string) {
    super(serviceName)

    this.metadata = {
      service: serviceName,
      environment: getEnvironment().isDev ? 'development' : 'production',
      timestamp: new Date().toISOString(),
    }

    // Initialize Supabase client
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    }
  }

  public static getInstance(serviceName: string): CentralizedLogger {
    if (!CentralizedLogger._instance) {
      CentralizedLogger._instance = new CentralizedLogger(serviceName)
    }
    return CentralizedLogger._instance
  }

  private async logToDatabase(level: string, message: string, metadata: any = {}) {
    if (!this.supabase) return

    try {
      const logEntry: Omit<ErrorLogEntry, 'id' | 'created_at'> = {
        service_name: this.metadata.service!,
        error_type: metadata.type || 'UNKNOWN_ERROR',
        severity: this.mapLogLevelToSeverity(level),
        message,
        stack_trace: metadata.stack,
        metadata: this.sanitizeMetadata(metadata),
        context: metadata.context || {},
        environment: this.metadata.environment!,
        user_id: metadata.userId,
        request_id: metadata.requestId,
        correlation_id: metadata.correlationId,
      }

      const { error } = await this.supabase.from('error_logs').insert(logEntry)

      if (error) {
        console.error('Failed to log to database:', error)
      }
    } catch (err) {
      console.error('Error logging to database:', err)
    }
  }

  private sanitizeMetadata(metadata: LogMetadata): Partial<LogMetadata> {
    const sanitized = { ...metadata }
    delete sanitized.stack
    delete sanitized.password
    delete sanitized.token
    return sanitized
  }

  private mapLogLevelToSeverity(level: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (level) {
      case 'error':
        return 'critical'
      case 'warn':
        return 'high'
      case 'info':
        return 'medium'
      default:
        return 'low'
    }
  }

  override async error(message: string, ...args: any[]) {
    await super.error(message, ...args)
    await this.logToDatabase('error', message, args[0])
  }

  override async warn(message: string, ...args: any[]) {
    await super.warn(message, ...args)
    await this.logToDatabase('warn', message, args[0])
  }

  override async info(message: string, ...args: any[]) {
    await super.info(message, ...args)
    await this.logToDatabase('info', message, args[0])
  }
}

// Factory function
export const createCentralizedLogger = (serviceName: string): CentralizedLogger => {
  return CentralizedLogger.getInstance(serviceName)
}
