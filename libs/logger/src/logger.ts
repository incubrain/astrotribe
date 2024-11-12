// utils/logger.ts
import { createConsola } from 'consola'
import type { ConsolaInstance } from 'consola'
import type { Logger, LogLevels } from './error-interface'
import { getEnvironment } from './environment'

export class BaseLogger implements Logger {
  protected logger: ConsolaInstance | Logger
  protected env = getEnvironment()

  constructor(tag = '') {
    this.logger = createConsola({
      level: this.env.isDev ? 10 : 3,
      formatOptions: {
        date: this.env.isNode,
        colors: true,
      },
    }).withTag(tag.toUpperCase())
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args)
  }

  info(message: string, ...args: any[]) {
    this.logger.info(message, ...args)
  }

  verbose(message: string, ...args: any[]) {
    if (this.env.isDev) {
      this.logger.verbose(message, ...args)
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.env.isDev) {
      this.logger.debug(message, ...args)
    }
  }

  silly(message: string, ...args: any[]) {
    if (this.env.isDev) {
      this.logger.info(message, ...args)
    }
  }

  http(message: string, ...args: any[]) {
    this.logger.info(message, ...args)
  }
}

let winstonPackage: typeof import('winston') | undefined = undefined

export class NodeLogger extends BaseLogger {
  private winstonLogger: any

  constructor(tag = '') {
    super(tag)

    if (this.env.isNode) {
      this.initWinston(tag).catch((err) => {
        this.logger.error('Failed to initialize Winston:', err)
      })
    }
  }

  private async initWinston(tag: string) {
    try {
      if (!winstonPackage) {
        winstonPackage = await import('winston')
      }

      const format = winstonPackage.format.combine(
        winstonPackage.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winstonPackage.format.cli(),
        winstonPackage.format.printf(
          (info) => `${info['timestamp']} ${info.level}: [${tag}] ${info.message}`,
        ),
      )

      this.winstonLogger = winstonPackage.createLogger({
        levels: {
          error: 0,
          warn: 1,
          info: 2,
          http: 3,
          verbose: 4,
          debug: 5,
          silly: 6,
        },
        level: this.env.isDev ? 'silly' : 'info',
        format,
        transports: [
          new winstonPackage.transports.Console(),
          ...(this.env.isDev
            ? []
            : [
                new winstonPackage.transports.File({
                  filename: './data/logs/error.log',
                  level: 'error',
                }),
                new winstonPackage.transports.File({
                  filename: './data/logs/combined.log',
                }),
              ]),
        ],
      })
    } catch (err) {
      this.logger.warn('Winston not available, falling back to console logger')
    }
  }

  override error(message: string, ...args: any[]) {
    if (this.winstonLogger) {
      this.winstonLogger.error(message, ...args)
    } else {
      super.error(message, ...args)
    }
  }

  override warn(message: string, ...args: any[]) {
    if (this.winstonLogger) {
      this.winstonLogger.warn(message, ...args)
    } else {
      super.warn(message, ...args)
    }
  }

  override info(message: string, ...args: any[]) {
    if (this.winstonLogger) {
      this.winstonLogger.info(message, ...args)
    } else {
      super.info(message, ...args)
    }
  }

  override verbose(message: string, ...args: any[]) {
    if (this.winstonLogger && this.env.isDev) {
      this.winstonLogger.verbose(message, ...args)
    } else {
      super.verbose(message, ...args)
    }
  }

  override debug(message: string, ...args: any[]) {
    if (this.winstonLogger && this.env.isDev) {
      this.winstonLogger.debug(message, ...args)
    } else {
      super.debug(message, ...args)
    }
  }

  override silly(message: string, ...args: any[]) {
    if (this.winstonLogger && this.env.isDev) {
      this.winstonLogger.silly(message, ...args)
    } else {
      super.silly(message, ...args)
    }
  }

  override http(message: string, ...args: any[]) {
    if (this.winstonLogger) {
      this.winstonLogger.http(message, ...args)
    } else {
      super.http(message, ...args)
    }
  }
}

// Factory function to create the appropriate logger
export const createLogger = (tag = '') => {
  const env = getEnvironment()
  return env.isNode ? new NodeLogger(tag) : new BaseLogger(tag)
}

// Async version for when we want to ensure Winston is loaded
export const createLoggerAsync = async (tag = '') => {
  const logger = createLogger(tag)
  if (logger instanceof NodeLogger) {
    // Wait for Winston to initialize if needed
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return logger
}

// Framework-specific wrappers if needed
export const useLogger = (tag = '') => {
  return createLogger(tag)
}

export const useLoggerAsync = async (tag = '') => {
  return await createLoggerAsync(tag)
}
