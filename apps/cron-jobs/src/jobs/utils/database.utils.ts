// src/utils/db-utils.ts
import { PrismaClient } from '@astronera/db'
import type { CustomLogger } from '@core'

const prismaTables = {
  ad_daily_metrics: PrismaClient.prototype.adDailyMetrics,
  ad_packages: PrismaClient.prototype.adPackages,
  ad_variants: PrismaClient.prototype.adVariants,
  addresses: PrismaClient.prototype.addresses,
  ads: PrismaClient.prototype.ads,
  blacklisted_domains: PrismaClient.prototype.blacklistedDomains,
  blacklisted_urls: PrismaClient.prototype.blacklistedUrls,
  blocked_ips: PrismaClient.prototype.blockedIps,
  bookmark_folders: PrismaClient.prototype.bookmarkFolders,
  bookmarks: PrismaClient.prototype.bookmarks,
  categories: PrismaClient.prototype.categories,
  cities: PrismaClient.prototype.cities,
  classified_urls: PrismaClient.prototype.classifiedUrls,
  comments: PrismaClient.prototype.comments,
  companies: PrismaClient.prototype.companies,
  company_contacts: PrismaClient.prototype.companyContacts,
  company_employees: PrismaClient.prototype.companyEmployees,
  company_extras: PrismaClient.prototype.companyExtras,
  company_metrics: PrismaClient.prototype.companyMetrics,
  company_urls: PrismaClient.prototype.companyUrls,
  contacts: PrismaClient.prototype.contacts,
  content_categories: PrismaClient.prototype.contentCategories,
  content_source_visits: PrismaClient.prototype.contentSourceVisits,
  content_sources: PrismaClient.prototype.contentSources,
  content_statuses: PrismaClient.prototype.contentStatuses,
  content_tags: PrismaClient.prototype.contentTags,
  contents: PrismaClient.prototype.contents,
  countries: PrismaClient.prototype.countries,
  customer_payments: PrismaClient.prototype.customerPayments,
  customer_processed_webhooks: PrismaClient.prototype.customerProcessedWebhooks,
  customer_refunds: PrismaClient.prototype.customerRefunds,
  customer_subscription_plans: PrismaClient.prototype.customerSubscriptionPlans,
  customer_subscriptions: PrismaClient.prototype.customerSubscriptions,
  embedding_reviews: PrismaClient.prototype.embeddingReviews,
  error_logs: PrismaClient.prototype.errorLogs,
  feature_requests: PrismaClient.prototype.featureRequests,
  feature_votes: PrismaClient.prototype.featureVotes,
  feed_categories: PrismaClient.prototype.feedCategories,
  feed_sources: PrismaClient.prototype.feedSources,
  feedbacks: PrismaClient.prototype.feedbacks,
  feeds: PrismaClient.prototype.feeds,
  follows: PrismaClient.prototype.follows,
  metric_definitions: PrismaClient.prototype.metricDefinitions,
  news: PrismaClient.prototype.news,
  news_summaries: PrismaClient.prototype.newsSummaries,
  news_tags: PrismaClient.prototype.newsTags,
  newsletters: PrismaClient.prototype.newsletters,
  payment_providers: PrismaClient.prototype.paymentProviders,
  plan_permissions: PrismaClient.prototype.planPermissions,
  referrals: PrismaClient.prototype.referrals,
  referrer_blocks: PrismaClient.prototype.referrerBlocks,
  research: PrismaClient.prototype.research,
  research_embeddings: PrismaClient.prototype.researchEmbeddings,
  responses: PrismaClient.prototype.responses,
  role_hierarchy: PrismaClient.prototype.roleHierarchy,
  role_permissions: PrismaClient.prototype.rolePermissions,
  role_permissions_materialized: PrismaClient.prototype.rolePermissionsMaterialized,
  scoring_weights: PrismaClient.prototype.scoringWeights,
  searches: PrismaClient.prototype.searches,
  social_media: PrismaClient.prototype.socialMedia,
  spider_metrics: PrismaClient.prototype.spiderMetrics,
  strapi_migrations: PrismaClient.prototype.strapiMigrations,
  strapi_migrations_internal: PrismaClient.prototype.strapiMigrationsInternal,
  table_maintenance_log: PrismaClient.prototype.tableMaintenanceLog,
  // security_metrics: PrismaClient.prototype.securityMetrics,
  // table_query_performance: PrismaClient.prototype.tableQueryPerformance,
  // error_metrics: PrismaClient.prototype.errorMetrics,
  // table_sequence_usage: PrismaClient.prototype.tableSequenceUsage,
  table_statistics: PrismaClient.prototype.tableStatistics,
  tags: PrismaClient.prototype.tags,
  user_metrics: PrismaClient.prototype.userMetrics,
  user_profiles: PrismaClient.prototype.userProfiles,
  votes: PrismaClient.prototype.votes,
} as const

export type PrismaTables = typeof prismaTables
export type PrismaTableNames = keyof typeof prismaTables

type PrismaDelegate = {
  update: (args: { where: { id: number | string }; data: any }) => Promise<any>
  upsert: (args: { where: { id: number | string }; create: any; update: any }) => Promise<any>
  findUnique: (args: { where: { id: number | string }; select?: any }) => Promise<any>
}

export function getPrismaDelegate(
  prisma: PrismaClient,
  table: any,
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
    batchSize = 20,
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
