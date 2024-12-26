// src/utils/db-utils.ts
import { PrismaClient } from '@prisma/client'
import type { CustomLogger } from '@core'

export class DatabaseUtils {
  /**
   * Converts BigInt values to numbers recursively throughout an object/array
   * Useful when working with ID fields from PostgreSQL
   */
  static convertBigIntToNumber(obj: any): any {
    if (obj === null || obj === undefined) return obj
    if (typeof obj === 'bigint') return Number(obj)
    if (Array.isArray(obj)) {
      return obj.map((item) => DatabaseUtils.convertBigIntToNumber(item))
    }
    if (typeof obj === 'object') {
      const newObj: any = {}
      for (const key in obj) {
        newObj[key] = DatabaseUtils.convertBigIntToNumber(obj[key])
      }
      return newObj
    }
    return obj
  }

  /**
   * Handles incrementing failure count for any source/entity
   */
  static async handleEntityFailure<T extends { id: number | string }>(
    prisma: PrismaClient,
    logger: CustomLogger,
    table: string,
    entity: T,
    error: Error,
    options?: {
      maxFailures?: number
      disableAfterFailure?: boolean
    },
  ) {
    try {
      await prisma[table].update({
        where: { id: entity.id },
        data: {
          has_failed: true,
          failed_count: { increment: 1 },
          ...(options?.disableAfterFailure ? { is_active: false } : {}),
        },
      })

      // Optional: Disable entity if it exceeds max failures
      if (options?.maxFailures) {
        const updatedEntity = await prisma[table].findUnique({
          where: { id: entity.id },
          select: { failed_count: true },
        })

        if (updatedEntity?.failed_count >= options.maxFailures) {
          await prisma[table].update({
            where: { id: entity.id },
            data: { is_active: false },
          })
        }
      }
    } catch (updateError: any) {
      logger.error(`Failed to update ${table} failure count`, {
        error: updateError,
        context: { entityId: entity.id },
      })
    }
  }

  /**
   * Safely handles PostgreSQL-specific JSON operations
   */
  static jsonOperations = {
    arrayToJsonb: (arr: any[]) => JSON.stringify(arr),
    objectToJsonb: (obj: object) => JSON.stringify(obj),
    mergePgJsonb: (existing: any, update: any) => ({
      ...existing,
      ...update,
    }),
  }

  /**
   * Handles PostgreSQL-specific timestamp operations
   */
  static timestampOperations = {
    nowUtc: () => new Date().toISOString(),
    addHours: (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000),
    subtractHours: (date: Date, hours: number) => new Date(date.getTime() - hours * 60 * 60 * 1000),
    startOfDay: (date: Date) => new Date(date.setHours(0, 0, 0, 0)),
  }

  /**
   * Handles batch operations with proper chunking
   */
  static async batchProcess<T, R>({
    items,
    batchSize = 1000,
    processor,
    logger,
  }: {
    items: T[]
    batchSize?: number
    processor: (batch: T[]) => Promise<R[]>
    logger: CustomLogger
  }): Promise<R[]> {
    const results: R[] = []
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      try {
        const batchResults = await processor(batch)
        results.push(...batchResults)
      } catch (error: any) {
        logger.error('Batch processing failed', {
          error,
          context: { batchIndex: i, batchSize },
        })
      }
    }
    return results
  }

  /**
   * Handles safe transaction execution with retries
   */
  static async executeTransaction<T>({
    prisma,
    logger,
    operation,
    maxRetries = 3,
    retryDelay = 1000,
  }: {
    prisma: PrismaClient
    logger: CustomLogger
    operation: (tx: PrismaClient) => Promise<T>
    maxRetries?: number
    retryDelay?: number
  }): Promise<T> {
    let attempts = 0
    while (attempts < maxRetries) {
      try {
        return await prisma.$transaction(async (tx: any) => {
          return await operation(tx)
        })
      } catch (error: any) {
        attempts++
        logger.error('Transaction failed', {
          error,
          context: { attempt: attempts, maxRetries },
        })

        if (attempts === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      }
    }
    throw new Error('Transaction failed after max retries')
  }

  /**
   * Upsert helper with proper type handling
   */
  static async safeUpsert<T>({
    prisma,
    logger,
    table,
    where,
    create,
    update,
  }: {
    prisma: PrismaClient
    logger: CustomLogger
    table: string
    where: any
    create: any
    update: any
  }): Promise<T> {
    try {
      return await prisma[table].upsert({
        where,
        create: {
          ...create,
          created_at: new Date(),
          updated_at: new Date(),
        },
        update: {
          ...update,
          updated_at: new Date(),
        },
      })
    } catch (error: any) {
      logger.error('Upsert operation failed', {
        error,
        context: { table, where },
      })
      throw error
    }
  }
}
