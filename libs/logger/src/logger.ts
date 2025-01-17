// logger.ts
import type { Logger as WinstonLogger } from 'winston'
import type { TransportStreamOptions } from 'winston-transport'

// Extend TransportStreamOptions for FileTransportOptions
interface FileTransportOptions extends TransportStreamOptions {
  filename: string
  maxsize?: number
  maxFiles?: number
  tailable?: boolean
  maxRetries?: number
  zippedArchive?: boolean
  level?: string
  format?: any // Winston format type is complex, using any for now
}

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
      const winston = w.default ?? w

      const format = winston.format.combine(
        winston.format.printf((info) => String(info.message ?? 'Message undefined')),
      )

      this.logger = winston.createLogger({
        level: this.isDev ? 'silly' : 'info',
        format,
        transports: [new winston.transports.Console()],
      })

      // Production file transports
      if (!this.isDev) {
        const errorTransport = new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.uncolorize(),
            winston.format.json(),
          ),
        } as FileTransportOptions)

        const combinedTransport = new winston.transports.File({
          filename: './logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.uncolorize(),
            winston.format.json(),
          ),
        } as FileTransportOptions)

        await this.addTransport(errorTransport)
        await this.addTransport(combinedTransport)
      }

      this.initialized = true

      // Process queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift()
        if (msg) this.logger.log(msg.level, msg.message)
      }
    } catch (error) {
      console.error('Failed to initialize Winston logger:', error)
      throw error
    }
  }

  public async addTransport(transport: any) {
    if (!this.initialized) {
      await this.initPromise
    }

    if (this.logger) {
      this.logger.add(transport)
    }
  }

  async log(level: Level, message: string) {
    if (typeof process === 'undefined' || process.env.CLIENT_SIDE) {
      console.error('Logger not initialized', message)
      return
    }

    if (this.initPromise) {
      await this.initPromise
    }

    if (!this.initialized || !this.logger) {
      this.messageQueue.push({ level, message })
      return
    }

    this.logger.log(level, message)
  }
}
