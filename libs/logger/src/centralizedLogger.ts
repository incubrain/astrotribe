import type { H3Event } from 'h3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getEnvironment } from './environment.js'
import type { ErrorLogEntry } from './error-interface.js'
import type { Service, ServiceToDomain } from './enums-domains.js'
import {
  NodeWinstonTransport,
  BrowserConsoleTransport,
  Level,
  type LogTransport,
} from './logger.js'

// ANSI constants
const ANSI = {
  reset: '\x1b[0m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  bgRed: '\x1b[41m',
  bgBlack: '\x1b[40m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
} as const

const error_type = {
  UNKNOWN_ERROR: 'unknown_error',
} as const

// Icons for levels
const levelIcons: Record<string, string> = {
  [Level.Error]: '❗',
  [Level.Warn]: '⚠️',
  [Level.Info]: 'ℹ️',
  [Level.Debug]: '🐛',
  [Level.Verbose]: '🔍',
  [Level.Silly]: '🤪',
}

interface ConsoleData {
  level: string
  message: string
  service: string
  domain?: string
  timestamp?: string
  stack?: string
  method?: string
  path?: string
}

export class CentralizedLogger<S extends Service = Service> {
  private static instance: CentralizedLogger | null = null
  private supabase: SupabaseClient | null = null
  protected env: ReturnType<typeof getEnvironment>
  private currentService?: S

  // Defaults
  private service: string = 'initializing'
  private domain: string = 'none'
  private transport: LogTransport

  private constructor() {
    this.env = getEnvironment()
    this.initSupabase()

    if (this.env.isBrowser || !this.env.isNode) {
      this.transport = new BrowserConsoleTransport()
    } else {
      this.transport = new NodeWinstonTransport(this.env.isDev)
    }
  }

  public static create<S extends Service>(): CentralizedLogger<S> {
    if (!CentralizedLogger.instance) {
      CentralizedLogger.instance = new CentralizedLogger()
    }
    return CentralizedLogger.instance as CentralizedLogger<S>
  }

  // Keep setServiceName and setDomain if needed
  public setServiceName(name: S) {
    this.currentService = name
    this.service = name
  }

  public setDomain(domain: ServiceToDomain[S]) {
    if (!this.currentService) {
      throw new Error('Service must be set before setting domain')
    }
    this.domain = domain
  }

  private initSupabase() {
    if (this.env.supabase?.url && this.env.supabase?.serviceKey) {
      try {
        this.supabase = createClient(this.env.supabase.url, this.env.supabase.serviceKey)
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err)
        throw err
      }
    } else {
      throw new Error('Supabase URL and service key are required')
    }
  }

  private sanitize(data: any) {
    const clean = { ...data }
    delete clean.password
    delete clean.token
    delete clean.secret
    delete clean.authorization
    delete clean.event
    return clean
  }

  private bold(text: string) {
    return `\x1b[1m${text}\x1b[0m`
  }

  private formatStackTrace(stack: string): string {
    return stack
      .split('\n')
      .map((line) => {
        if (line.trim().startsWith('at ')) {
          const [start, location] = line.split('(')
          if (location) {
            return `${ANSI.gray}${start}(${ANSI.cyan}${location.slice(0, -1)}${ANSI.gray})${ANSI.reset}`
          }
          return `${ANSI.gray}${line}${ANSI.reset}`
        }
        return line
      })
      .join('\n')
  }

  private formatLevelBadge(level: string): string {
    const upperLevel = level.toUpperCase()
    if (level === 'error') {
      return `${ANSI.bgRed}${ANSI.white}${ANSI.bright} ${upperLevel} ${ANSI.reset}`
    } else if (level === 'warn') {
      return `${ANSI.bgBlack}${ANSI.white}${ANSI.bright} ${upperLevel} ${ANSI.reset}`
    }
    return upperLevel
  }

  private getSeverity(level: string): 'low' | 'medium' | 'high' | 'critical' {
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

  private async extractEventData(event?: H3Event) {
    if (!this.env.isNode || !event) return null

    try {
      const { getRequestURL, getRequestHeaders, getQuery } = await import('h3')
      return {
        url: getRequestURL(event).toString(),
        method: event.method,
        headers: getRequestHeaders(event),
        query: getQuery(event),
        timestamp: new Date().toISOString(),
        path: event.path,
      }
    } catch (error: any) {
      return null
    }
  }

  private async prepareMetadata(
    level: string,
    message: string,
    userMetadata: any = {},
  ): Promise<{ consoleData: ConsoleData; dbMetadata: Omit<ErrorLogEntry, 'id' | 'created_at'> }> {
    const timestamp = new Date().toISOString()
    const eventData = userMetadata?.event ? await this.extractEventData(userMetadata.event) : null

    const stack = userMetadata?.error?.stack

    if (eventData) {
      message = `${eventData.method} ${eventData.path} - ${message}`
    }

    const consoleData: ConsoleData = {
      level,
      message,
      service: this.service,
      domain: this.domain,
      timestamp,
      stack,
      method: eventData?.method,
      path: eventData?.path,
    }

    const dbMetadata = {
      service_name: this.service,
      domain: this.domain,
      error_type: error_type.UNKNOWN_ERROR,
      severity: this.getSeverity(level),
      message,
      stack_trace: stack,
      metadata: this.sanitize({
        timestamp,
        ...userMetadata,
        ...(eventData && { request: eventData }),
      }),
      context: userMetadata?.context || {},
      environment: this.env.isDev ? 'development' : 'production',
      request_id: eventData?.headers?.['x-request-id'] || userMetadata?.requestId || null,
      correlation_id:
        eventData?.headers?.['x-correlation-id'] || userMetadata?.correlationId || null,
    }

    return { consoleData, dbMetadata }
  }

  private formatLog(data: ConsoleData): string {
    const { level, message, service, domain, timestamp, stack } = data
    const icon = levelIcons[level] ?? ''
    const levelBadge = this.formatLevelBadge(level)
    const timestampStr = timestamp ? `${ANSI.gray}[${timestamp}]${ANSI.reset}` : ''

    let finalMessage = message
    if (level === 'error' && stack) {
      finalMessage += '\n' + this.formatStackTrace(stack)
    }

    return `${timestampStr} ${levelBadge} [${service}|${domain}] ${finalMessage}`
  }

  private async logToDatabase(dbMetadata: Omit<ErrorLogEntry, 'id' | 'created_at'>) {
    if (!this.supabase) return
    try {
      const { error: dbError } = await this.supabase.from('error_logs').insert(dbMetadata)
      if (dbError) console.error('Failed to log to database:', dbError)
    } catch (err) {
      console.error('Error logging to database:', err)
    }
  }

  private shouldLogLevel(level: Level): boolean {
    if (this.env.isNode) {
      // Node environment: Winston handles level filtering
      // but we can still manually prevent silly/debug in prod if needed
      if (
        !this.env.isDev &&
        (level === Level.Debug || level === Level.Silly || level === Level.Verbose)
      ) {
        return false
      }
      return true
    } else {
      // Browser: no Winston, just apply dev filters
      if (
        !this.env.isDev &&
        (level === Level.Debug || level === Level.Silly || level === Level.Verbose)
      ) {
        return false
      }
      return true
    }
  }

  private shouldStoreLog(level: Level): boolean {
    return level === Level.Error || level === Level.Warn
  }

  private async log(level: Level, message: string, metadata?: any) {
    try {
      // 1. Validate the level
      if (!Object.values(Level).includes(level)) {
        console.error('Invalid log level provided:', level)
        level = Level.Error // fallback
      }

      // 2. Check if we should skip verbose logs in production, etc.
      if (!this.shouldLogLevel(level)) {
        return
      }

      // 3. Prepare metadata (can throw if data is non-serializable)
      const { consoleData, dbMetadata } = await this.prepareMetadata(level, message, metadata)

      // 4. Format and log to transport
      const finalMessage = this.formatLog(consoleData)

      await (this.transport as NodeWinstonTransport).log(level, finalMessage)

      // 5. If it’s an error or warning, store to DB
      if (this.shouldStoreLog(level)) {
        void this.logToDatabase(dbMetadata)
      }
    } catch (error: any) {
      // Fallback in case something in prepareMetadata(), formatLog(), or transport fails
      console.error('Logger encountered an internal error while logging:', {
        originalLevel: level,
        originalMessage: message,
        originalMetadata: metadata,
        loggerError: error?.message,
        stack: error?.stack,
      })
    }
  }

  // Public logging methods
  public async error(message: string, metadata?: any) {
    return this.log(Level.Error, message, metadata)
  }

  public async warn(message: string, metadata?: any) {
    return this.log(Level.Warn, message, metadata)
  }

  public async info(message: string, metadata?: any) {
    return this.log(Level.Info, message, metadata)
  }

  public async verbose(message: string, metadata?: any) {
    return this.log(Level.Verbose, message, metadata)
  }

  public async debug(message: string, metadata?: any) {
    return this.log(Level.Debug, message, metadata)
  }

  public async silly(message: string, metadata?: any) {
    return this.log(Level.Silly, message, metadata)
  }
}

// Factory function
export const createCentralizedLogger = <S extends Service>() => CentralizedLogger.create<S>()
