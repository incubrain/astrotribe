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

// Browser console transport
export class BrowserConsoleTransport implements LogTransport {
  log(level: Level, message: string) {
    if (level === Level.Error) {
      console.error(message)
    } else if (level === Level.Warn) {
      console.warn(message)
    } else if (level === Level.Info) {
      console.info(message)
    } else {
      console.log(message)
    }
  }
}

// Node Winston transport
export class NodeWinstonTransport implements LogTransport {
  public initialized = false
  private logger: import('winston').Logger | undefined
  private isDev: boolean

  constructor(isDev: boolean) {
    this.isDev = isDev
    this.init()
  }

  async init() {
    const w = await import('winston')
    const winston = w ?? w

    const format = winston.format.combine(
      winston.format.printf(({ message }) => {
        return `${message}`
      }),
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
  }

  log(level: Level, message: string) {
    if (!this.initialized || !this.logger) {
      throw new Error('NodeWinstonTransport not initialized. Call await init() first.')
    }
    this.logger.log(level, message)
  }
}
