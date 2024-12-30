// src/utils/db-utils.ts
import { PrismaClient } from '@prisma/client'
import type { CustomLogger } from '@core'

export type PrismaTables = {
  ad_daily_metrics: PrismaClient['ad_daily_metrics']
  ad_packages: PrismaClient['ad_packages']
  ad_variants: PrismaClient['ad_variants']
  addresses: PrismaClient['addresses']
  ads: PrismaClient['ads']
  blacklisted_domains: PrismaClient['blacklisted_domains']
  blacklisted_urls: PrismaClient['blacklisted_urls']
  blocked_ips: PrismaClient['blocked_ips']
  bookmark_folders: PrismaClient['bookmark_folders']
  bookmarks: PrismaClient['bookmarks']
  categories: PrismaClient['categories']
  cities: PrismaClient['cities']
  classified_urls: PrismaClient['classified_urls']
  comments: PrismaClient['comments']
  companies: PrismaClient['companies']
  company_contacts: PrismaClient['company_contacts']
  company_employees: PrismaClient['company_employees']
  company_extras: PrismaClient['company_extras']
  company_metrics: PrismaClient['company_metrics']
  company_urls: PrismaClient['company_urls']
  contacts: PrismaClient['contacts']
  content_categories: PrismaClient['content_categories']
  content_source_visits: PrismaClient['content_source_visits']
  content_sources: PrismaClient['content_sources']
  content_statuses: PrismaClient['content_statuses']
  content_tags: PrismaClient['content_tags']
  contents: PrismaClient['contents']
  countries: PrismaClient['countries']
  customer_payments: PrismaClient['customer_payments']
  customer_processed_webhooks: PrismaClient['customer_processed_webhooks']
  customer_refunds: PrismaClient['customer_refunds']
  customer_subscription_plans: PrismaClient['customer_subscription_plans']
  customer_subscriptions: PrismaClient['customer_subscriptions']
  embedding_reviews: PrismaClient['embedding_reviews']
  error_logs: PrismaClient['error_logs']
  error_metrics: PrismaClient['error_metrics']
  feature_requests: PrismaClient['feature_requests']
  feature_votes: PrismaClient['feature_votes']
  feed_categories: PrismaClient['feed_categories']
  feed_sources: PrismaClient['feed_sources']
  feedbacks: PrismaClient['feedbacks']
  feeds: PrismaClient['feeds']
  follows: PrismaClient['follows']
  metric_definitions: PrismaClient['metric_definitions']
  news: PrismaClient['news']
  news_summaries: PrismaClient['news_summaries']
  news_tags: PrismaClient['news_tags']
  newsletters: PrismaClient['newsletters']
  payment_providers: PrismaClient['payment_providers']
  plan_permissions: PrismaClient['plan_permissions']
  referrals: PrismaClient['referrals']
  referrer_blocks: PrismaClient['referrer_blocks']
  research: PrismaClient['research']
  research_embeddings: PrismaClient['research_embeddings']
  responses: PrismaClient['responses']
  role_hierarchy: PrismaClient['role_hierarchy']
  role_permissions: PrismaClient['role_permissions']
  role_permissions_materialized: PrismaClient['role_permissions_materialized']
  scoring_weights: PrismaClient['scoring_weights']
  searches: PrismaClient['searches']
  security_metrics: PrismaClient['security_metrics']
  social_media: PrismaClient['social_media']
  spider_metrics: PrismaClient['spider_metrics']
  strapi_migrations: PrismaClient['strapi_migrations']
  strapi_migrations_internal: PrismaClient['strapi_migrations_internal']
  table_maintenance_log: PrismaClient['table_maintenance_log']
  table_query_performance: PrismaClient['table_query_performance']
  table_sequence_usage: PrismaClient['table_sequence_usage']
  table_statistics: PrismaClient['table_statistics']
  tags: PrismaClient['tags']
  user_metrics: PrismaClient['user_metrics']
  user_profiles: PrismaClient['user_profiles']
  votes: PrismaClient['votes']
}

export type PrismaTableNames = keyof PrismaTables

export function getPrismaDelegate<T extends PrismaTableNames>(
  prisma: PrismaClient,
  table: T,
): PrismaTables[T] {
  return prisma[table] as PrismaTables[T]
}

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
    table: PrismaTableNames,
    entity: T,
    error: Error,
    options?: {
      maxFailures?: number
      disableAfterFailure?: boolean
    },
  ) {
    try {
      const delegate = getPrismaDelegate(prisma, table)

      await delegate.update({
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
          await prisma[table as PrismaTableNames].update({
            where: { id: entity.id },
            data: { is_active: false },
          })
        }
      }
    } catch (updateError: any) {
      logger.error(`Failed to update ${String(table)} failure count`, {
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
    table: PrismaTableNames
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
