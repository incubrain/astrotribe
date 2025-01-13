// src/core/services/prisma.service.ts
import { PrismaClient } from '@astronera/db'
import { config } from '../../config'
import { CustomLogger } from './logger.service'

export class PrismaService extends PrismaClient {
  private isConnected = false

  constructor(private readonly logger: CustomLogger) {
    console.log('config.database.url', config.database.directUrl)
    super({
      datasources: {
        db: {
          url: config.database.directUrl,
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    })

    this.setupLogging()
  }

  private setupLogging() {
    // Log queries in development
    if (config.app.environment === 'development') {
      this.$on('query' as any, (e: any) => {
        this.logger.debug('Query executed', {
          query: e.query,
          duration: e.duration,
          timestamp: e.timestamp,
        })
      })
    }

    // Always log errors
    this.$on('error' as any, (e: any) => {
      this.logger.error('Prisma error occurred', {
        ...e,
      })
    })

    this.$on('warn' as any, (e: any) => {
      this.logger.warn('Prisma warning', {
        message: e.message,
        target: e.target,
      })
    })
  }

  async connect() {
    try {
      this.logger.info('Connecting to database', {
        // Log redacted URLs for debugging
        url: config.database.url?.replace(/:[^:\/]+@/, ':****@'),
        directUrl: config.database.directUrl?.replace(/:[^:\/]+@/, ':****@'),
      })

      await this.$connect() // Use $connect from super
      this.isConnected = true
      this.logger.info('Database connected successfully')
    } catch (error: any) {
      this.logger.error('Database connection failed', {
        error,
        context: {
          stack: error.stack,
        },
      })
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await this.$disconnect() // Use $disconnect from super
      this.isConnected = false
      this.logger.info('Database disconnected successfully')
    } catch (error: any) {
      this.logger.error('Error disconnecting from database', error)
      throw error
    }
  }

  /**
   * Execute a database transaction with automatic retries
   */
  async transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxRetries?: number
      timeout?: number
    },
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? 3
    const timeout = options?.timeout ?? 5000

    let attempt = 0
    while (attempt < maxRetries) {
      try {
        return await this.$transaction(fn, {
          timeout,
          maxWait: timeout * 2,
        })
      } catch (error: any) {
        attempt++
        const shouldRetry = attempt < maxRetries && this.isPrismaError(error)

        if (!shouldRetry) {
          throw error
        }

        this.logger.warn('Transaction failed, retrying...', {
          attempt,
          maxRetries,
          error,
        })

        // Wait before retrying with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
      }
    }

    throw new Error('Transaction failed after max retries')
  }

  private isPrismaError(error: unknown): boolean {
    return error instanceof Error && error.constructor.name.startsWith('PrismaClient')
  }
}
