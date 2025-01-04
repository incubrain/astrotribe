// src/utils/db-utils.ts
import { PrismaClient } from '@prisma/client'
import type { CustomLogger } from '@core'

const prismaTables = {
  ad_daily_metrics: PrismaClient.prototype.ad_daily_metrics,
  ad_packages: PrismaClient.prototype.ad_packages,
  ad_variants: PrismaClient.prototype.ad_variants,
  addresses: PrismaClient.prototype.addresses,
  ads: PrismaClient.prototype.ads,
  blacklisted_domains: PrismaClient.prototype.blacklisted_domains,
  blacklisted_urls: PrismaClient.prototype.blacklisted_urls,
  blocked_ips: PrismaClient.prototype.blocked_ips,
  bookmark_folders: PrismaClient.prototype.bookmark_folders,
  bookmarks: PrismaClient.prototype.bookmarks,
  categories: PrismaClient.prototype.categories,
  cities: PrismaClient.prototype.cities,
  classified_urls: PrismaClient.prototype.classified_urls,
  comments: PrismaClient.prototype.comments,
  companies: PrismaClient.prototype.companies,
  company_contacts: PrismaClient.prototype.company_contacts,
  company_employees: PrismaClient.prototype.company_employees,
  company_extras: PrismaClient.prototype.company_extras,
  company_metrics: PrismaClient.prototype.company_metrics,
  company_urls: PrismaClient.prototype.company_urls,
  contacts: PrismaClient.prototype.contacts,
  content_categories: PrismaClient.prototype.content_categories,
  content_source_visits: PrismaClient.prototype.content_source_visits,
  content_sources: PrismaClient.prototype.content_sources,
  content_statuses: PrismaClient.prototype.content_statuses,
  content_tags: PrismaClient.prototype.content_tags,
  contents: PrismaClient.prototype.contents,
  countries: PrismaClient.prototype.countries,
  customer_payments: PrismaClient.prototype.customer_payments,
  customer_processed_webhooks: PrismaClient.prototype.customer_processed_webhooks,
  customer_refunds: PrismaClient.prototype.customer_refunds,
  customer_subscription_plans: PrismaClient.prototype.customer_subscription_plans,
  customer_subscriptions: PrismaClient.prototype.customer_subscriptions,
  embedding_reviews: PrismaClient.prototype.embedding_reviews,
  error_logs: PrismaClient.prototype.error_logs,
  feature_requests: PrismaClient.prototype.feature_requests,
  feature_votes: PrismaClient.prototype.feature_votes,
  feed_categories: PrismaClient.prototype.feed_categories,
  feed_sources: PrismaClient.prototype.feed_sources,
  feedbacks: PrismaClient.prototype.feedbacks,
  feeds: PrismaClient.prototype.feeds,
  follows: PrismaClient.prototype.follows,
  metric_definitions: PrismaClient.prototype.metric_definitions,
  news: PrismaClient.prototype.news,
  news_summaries: PrismaClient.prototype.news_summaries,
  news_tags: PrismaClient.prototype.news_tags,
  newsletters: PrismaClient.prototype.newsletters,
  payment_providers: PrismaClient.prototype.payment_providers,
  plan_permissions: PrismaClient.prototype.plan_permissions,
  referrals: PrismaClient.prototype.referrals,
  referrer_blocks: PrismaClient.prototype.referrer_blocks,
  research: PrismaClient.prototype.research,
  research_embeddings: PrismaClient.prototype.research_embeddings,
  responses: PrismaClient.prototype.responses,
  role_hierarchy: PrismaClient.prototype.role_hierarchy,
  role_permissions: PrismaClient.prototype.role_permissions,
  role_permissions_materialized: PrismaClient.prototype.role_permissions_materialized,
  scoring_weights: PrismaClient.prototype.scoring_weights,
  searches: PrismaClient.prototype.searches,
  social_media: PrismaClient.prototype.social_media,
  spider_metrics: PrismaClient.prototype.spider_metrics,
  strapi_migrations: PrismaClient.prototype.strapi_migrations,
  strapi_migrations_internal: PrismaClient.prototype.strapi_migrations_internal,
  table_maintenance_log: PrismaClient.prototype.table_maintenance_log,
  // security_metrics: PrismaClient.prototype.security_metrics,
  // table_query_performance: PrismaClient.prototype.table_query_performance,
  // error_metrics: PrismaClient.prototype.error_metrics,
  // table_sequence_usage: PrismaClient.prototype.table_sequence_usage,
  table_statistics: PrismaClient.prototype.table_statistics,
  tags: PrismaClient.prototype.tags,
  user_metrics: PrismaClient.prototype.user_metrics,
  user_profiles: PrismaClient.prototype.user_profiles,
  votes: PrismaClient.prototype.votes,
} as const

export type PrismaTables = typeof prismaTables
export type PrismaTableNames = keyof typeof prismaTables

type PrismaDelegate = {
  update: (args: { where: { id: number | string }; data: any }) => Promise<any>
  upsert: (args: { where: { id: number | string }; create: any; update: any }) => Promise<any>
  findUnique: (args: { where: { id: number | string }; select?: any }) => Promise<any>
}

export function getPrismaDelegate<T extends PrismaTableNames>(
  prisma: PrismaClient,
  table: T,
): PrismaDelegate {
  return prisma[table] as unknown as PrismaDelegate
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
        },
      })

      // Check max failures if specified
      if (options?.maxFailures) {
        const updatedEntity = await delegate.findUnique({
          where: { id: entity.id },
          select: { failed_count: true },
        })

        if (updatedEntity?.failed_count >= options.maxFailures) {
          // Instead of using is_active, we'll just keep has_failed as true
          // and use a high failed_count to indicate disabled state
          await delegate.update({
            where: { id: entity.id },
            data: {
              has_failed: true,
              updated_at: new Date(),
            },
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
      const delegate = getPrismaDelegate(prisma, table)

      return delegate.upsert({
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
