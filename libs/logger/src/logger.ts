// logger.ts
import type { Logger as WinstonLogger } from 'winston'

// Logging levels
export enum Level {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

// Transport interface
export interface LogTransport {
  log(level: Level, message: string): void
}

// Node Winston transport
export class NodeWinstonTransport implements LogTransport {
  public initialized = false
  private initPromise: Promise<void> | null = null
  private logger: WinstonLogger | undefined
  private messageQueue: Array<{ level: Level; message: string }> = []

  constructor(private isDev: boolean) {
    this.isDev = isDev
    this.initPromise = this.init()
  }

  async init(): Promise<void> {
    if (typeof process === 'undefined' || process.env.CLIENT_SIDE) {
      this.initialized = true
      return
    }

    if (this.initialized) return

    try {
      const w = await import('winston')
      const winston = w ?? w

      const format = winston.format.combine(
        winston.format.printf(({ message }) => String(message ?? 'Message undefined')),
      )

      this.logger = winston.createLogger({
        level: this.isDev ? 'silly' : 'info',
        format,
        transports: [new winston.transports.Console()],
      })

      if (!this.isDev) {
        // Add file transports in production
        this.logger.add(
          new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.uncolorize(),
              winston.format.json(),
            ),
          }),
        )

        this.logger.add(
          new winston.transports.File({
            filename: './logs/combined.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.uncolorize(),
              winston.format.json(),
            ),
          }),
        )
      }

      this.initialized = true

      // Process any queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift()
        if (msg) this.logger.log(msg.level, msg.message)
      }
    } catch (error) {
      console.error('Failed to initialize Winston logger:', error)
      throw error // Instead of falling back to console, fail explicitly
    }
  }

  async log(level: Level, message: string) {
    if (typeof process === 'undefined' || process.env.CLIENT_SIDE) {
      // In client-side context, just use console
      console.error('Logger not initialized', message)
      return
    }

    if (this.initPromise) {
      await this.initPromise
    }

    if (!this.initialized || !this.logger) {
      // Queue the message if not initialized
      this.messageQueue.push({ level, message })
      return
    }

    this.logger.log(level, message)
  }
}
