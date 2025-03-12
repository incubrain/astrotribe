// -----------------------------------------------------------------------
// WARNING: This file is auto-generated. DO NOT MODIFY IT MANUALLY.
// Any changes you make will be overwritten the next time the file
// is generated.
// -----------------------------------------------------------------------

import { z } from 'zod'

export const enums = {
  access_level: z.enum(['viewer', 'editor', 'admin', 'super_admin']),

  address_type: z.enum([
    'residential',
    'headquarters',
    'office',
    'factory',
    'lab',
    'warehouse',
    'research',
    'retail',
    'showroom',
    'branch',
  ]),

  app_plan_enum: z.enum(['free', 'basic', 'intermediate', 'premium', 'enterprise', 'custom']),

  app_role_enum: z.enum([
    'guest',
    'user',
    'astroguide',
    'mentor',
    'moderator',
    'tenant_member',
    'tenant_admin',
    'tenant_super_admin',
    'admin',
    'super_admin',
    'service_role',
  ]),

  contact_type: z.enum(['personal', 'company', 'professional', 'recruitment', 'founder']),

  content_status: z.enum([
    'draft',
    'pending_agent_action',
    'pending_agent_review',
    'pending_human_review',
    'pending_relevance_check',
    'irrelevant',
    'scheduled',
    'unpublished',
    'archived',
    'published',
    'failed',
    'pending_crawl',
    'scraped',
    'outdated',
    'updated',
    'new',
  ]),

  content_type: z.enum(['news', 'events', 'research', 'companies', 'contact', 'people', 'unknown']),

  feedback_status: z.enum([
    'new',
    'under_review',
    'backlog',
    'working_on',
    'resolved',
    'rejected',
    'deferred',
  ]),

  feedback_type: z.enum([
    'bug_report',
    'feature_request',
    'user_interface_issue',
    'performance_issue',
    'documentation',
  ]),

  followed_entity: z.enum(['company', 'user']),

  news_importance_level: z.enum(['high', 'medium', 'low']),

  news_relation_type: z.enum(['source', 'topic', 'mention']),

  priority: z.enum(['very_low', 'low', 'medium', 'high', 'critical']),

  privacy_level: z.enum(['private', 'connected', 'public']),

  scrape_frequency: z.enum([
    'four_times_daily',
    'twice_daily',
    'daily',
    'twice_weekly',
    'weekly',
    'bi_weekly',
    'monthly',
    'quarterly',
    'biannual',
    'annually',
    'never',
  ]),

  user_status: z.enum(['online', 'offline']),
}

export type AccessLevelType = z.infer<typeof enums.access_level>
export type AddressTypeType = z.infer<typeof enums.address_type>
export type AppPlanEnumType = z.infer<typeof enums.app_plan_enum>
export type AppRoleEnumType = z.infer<typeof enums.app_role_enum>
export type ContactTypeType = z.infer<typeof enums.contact_type>
export type ContentStatusType = z.infer<typeof enums.content_status>
export type ContentTypeType = z.infer<typeof enums.content_type>
export type FeedbackStatusType = z.infer<typeof enums.feedback_status>
export type FeedbackTypeType = z.infer<typeof enums.feedback_type>
export type FollowedEntityType = z.infer<typeof enums.followed_entity>
export type NewsImportanceLevelType = z.infer<typeof enums.news_importance_level>
export type NewsRelationTypeType = z.infer<typeof enums.news_relation_type>
export type PriorityType = z.infer<typeof enums.priority>
export type PrivacyLevelType = z.infer<typeof enums.privacy_level>
export type ScrapeFrequencyType = z.infer<typeof enums.scrape_frequency>
export type UserStatusType = z.infer<typeof enums.user_status>

export const tables = {
  addresses: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        street1: z.string().max(255).optional(),
        street2: z.string().max(255).nullable().optional(),
        city_id: z.number().int().optional(),
        country_id: z.number().int().optional(),
        name: z.string().nullable().optional(),
        user_id: z.string().uuid().nullable().optional(),
        is_primary: z.boolean().nullable().optional(),
        address_type: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        street1: z.string().optional(),
        street2: z.string().nullable().optional(),
        city_id: z.number().optional(),
        country_id: z.number().optional(),
        name: z.string().nullable().optional(),
        user_id: z.string().uuid().nullable().optional(),
        is_primary: z.boolean().nullable().optional(),
        address_type: z.string().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  blacklisted_domains: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        url: z.string().optional(),
        reason: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        created_at: z.date().optional(),
        url: z.string().optional(),
        reason: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  blacklisted_urls: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        url: z.string().optional(),
        reason: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        url: z.string().optional(),
        reason: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  bookmark_folders: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        name: z.string().max(255).optional(),
        color: z.string().max(7).nullable().optional(),
        parent_id: z.string().uuid().nullable().optional(),
        is_default: z.boolean().nullable().optional(),
        is_favorite: z.boolean().nullable().optional(),
        position: z.number().int().nullable().optional(),
        path: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        name: z.string().optional(),
        color: z.string().nullable().optional(),
        parent_id: z.string().uuid().nullable().optional(),
        is_default: z.boolean().nullable().optional(),
        is_favorite: z.boolean().nullable().optional(),
        position: z.number().nullable().optional(),
        path: z.string().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  bookmarks: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        content_type: z.string().max(50).optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        folder_id: z.string().uuid().nullable().optional(),
        metadata: z.unknown().nullable().optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        content_type: z.string().optional(),
        created_at: z.date().nullable().optional(),
        folder_id: z.string().uuid().nullable().optional(),
        metadata: z.unknown().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  categories: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        body: z.string().max(255).nullable().optional(),
        name: z.string().max(255).optional(),
        document_id: z.string().max(255).nullable().optional(),
        locale: z.string().max(255).nullable().optional(),
        published_at: z.string().max(255).nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().nullable().optional(),
        body: z.string().nullable().optional(),
        name: z.string().optional(),
        document_id: z.string().nullable().optional(),
        locale: z.string().nullable().optional(),
        published_at: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  cities: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        name: z.string().max(100).optional(),
        country_id: z.number().int().optional(),
        state: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        country_id: z.number().optional(),
        state: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  classified_urls: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        url: z.string().optional(),
        predicted_category: z.string().optional(),
        actual_category: z.string().optional(),
        is_reviewed: z.boolean().nullable().optional(),
        added_to_training: z.boolean().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        url: z.string().optional(),
        predicted_category: z.string().optional(),
        actual_category: z.string().optional(),
        is_reviewed: z.boolean().nullable().optional(),
        added_to_training: z.boolean().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  comments: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        content: z.string().optional(),
        user_id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        content_type: z.string().optional(),
        parent_comment_id: z.string().uuid().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        content: z.string().optional(),
        user_id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        content_type: z.string().optional(),
        parent_comment_id: z.string().uuid().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  companies: {
    inbound: z
      .object({
        name: z.string().max(255).nullable().optional(),
        description: z.string().nullable().optional(),
        logo_url: z.string().nullable().optional(),
        url: z.string().optional(),
        social_media_id: z.number().int().nullable().optional(),
        scrape_frequency: enums.scrape_frequency.nullable().optional(),
        category_id: z.number().int().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        founding_year: z.number().int().nullable().optional(),
        is_government: z.boolean().nullable().optional(),
        category: z.string().nullable().optional(),
        failed_count: z.number().int().nullable().optional(),
        is_english: z.boolean().nullable().optional(),
        scrape_rating: z.number().int().nullable().optional(),
        id: z.string().uuid().optional(),
        scraped_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        content_status: enums.content_status.optional(),
        keywords: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        name: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        logo_url: z.string().nullable().optional(),
        url: z.string().optional(),
        social_media_id: z.number().nullable().optional(),
        scrape_frequency: enums.scrape_frequency.nullable().optional(),
        category_id: z.number().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        founding_year: z.number().nullable().optional(),
        is_government: z.boolean().nullable().optional(),
        category: z.string().nullable().optional(),
        failed_count: z.number().nullable().optional(),
        is_english: z.boolean().nullable().optional(),
        scrape_rating: z.number().nullable().optional(),
        id: z.string().uuid().optional(),
        scraped_at: z.date().nullable().optional(),
        content_status: enums.content_status.optional(),
        keywords: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  company_contacts: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        contact_id: z.number().int().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        contact_id: z.number().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  company_employees: {
    inbound: z
      .object({
        user_id: z.string().uuid().optional(),
        role: z.string().optional(),
        job_description: z.string().nullable().optional(),
        start_date: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        end_date: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        status: z.boolean().nullable().optional(),
        access_level: enums.access_level.optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        user_id: z.string().uuid().optional(),
        role: z.string().optional(),
        job_description: z.string().nullable().optional(),
        start_date: z.date().nullable().optional(),
        end_date: z.date().nullable().optional(),
        status: z.boolean().nullable().optional(),
        access_level: enums.access_level.optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  company_extras: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        url: z.string().optional(),
        success: z.boolean().nullable().optional(),
        category: z.string().optional(),
        level: z.number().int().optional(),
        company_id: z.string().uuid().nullable().optional(),
        body: z.string().nullable().optional(),
        found_count: z.number().int().nullable().optional(),
        review: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        updated_at: z.date().optional(),
        created_at: z.date().optional(),
        url: z.string().optional(),
        success: z.boolean().nullable().optional(),
        category: z.string().optional(),
        level: z.number().optional(),
        company_id: z.string().uuid().nullable().optional(),
        body: z.string().nullable().optional(),
        found_count: z.number().nullable().optional(),
        review: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  company_metrics: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        crawl_id: z.string().uuid().optional(),
        company_id: z.string().uuid().optional(),
        metric_id: z.number().int().nullable().optional(),
        timestamp: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        value: z.unknown().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        crawl_id: z.string().uuid().optional(),
        company_id: z.string().uuid().optional(),
        metric_id: z.number().nullable().optional(),
        timestamp: z.date().optional(),
        value: z.unknown().optional(),
      })
      .strict()
      .optional(),
  },

  company_urls: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        url: z.string().optional(),
        success: z.boolean().nullable().optional(),
        category: z.string().optional(),
        company_id: z.string().uuid().nullable().optional(),
        content: z.string().nullable().optional(),
        distance: z.number().int().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        updated_at: z.date().optional(),
        created_at: z.date().optional(),
        url: z.string().optional(),
        success: z.boolean().nullable().optional(),
        category: z.string().optional(),
        company_id: z.string().uuid().nullable().optional(),
        content: z.string().nullable().optional(),
        distance: z.number().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  contacts: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        title: z.string().max(100).nullable().optional(),
        is_primary: z.boolean().nullable().optional(),
        email: z.string().max(255).nullable().optional(),
        contact_type: z.string().optional(),
        privacy_level: z.string().optional(),
        user_id: z.string().uuid().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        phone: z.string().max(50).nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        title: z.string().nullable().optional(),
        is_primary: z.boolean().nullable().optional(),
        email: z.string().nullable().optional(),
        contact_type: z.string().optional(),
        privacy_level: z.string().optional(),
        user_id: z.string().uuid().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        phone: z.string().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  content_categories: {
    inbound: z
      .object({
        content_id: z.string().uuid().optional(),
        category_id: z.number().int().optional(),
        is_primary: z.boolean().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        content_id: z.string().uuid().optional(),
        category_id: z.number().optional(),
        is_primary: z.boolean().optional(),
      })
      .strict()
      .optional(),
  },

  content_sources: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        url: z.string().optional(),
        content_type: z.string().optional(),
        scrape_frequency: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        refreshed_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        has_failed: z.boolean().nullable().optional(),
        failed_count: z.number().int().nullable().optional(),
        priority: z.string().optional(),
        hash: z.unknown().nullable().optional(),
        scraped_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        expected_count: z.number().int().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
        rss_urls: z
          .array(z.string())
          .transform((val) => val.join(','))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        url: z.string().optional(),
        content_type: z.string().optional(),
        scrape_frequency: z.string().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        refreshed_at: z.date().nullable().optional(),
        has_failed: z.boolean().nullable().optional(),
        failed_count: z.number().nullable().optional(),
        priority: z.string().optional(),
        hash: z.unknown().nullable().optional(),
        scraped_at: z.date().nullable().optional(),
        expected_count: z.number().nullable().optional(),
        company_id: z.string().uuid().nullable().optional(),
        rss_urls: z
          .union([z.array(z.string()).optional(), z.string().optional()])
          .optional()
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
  },

  content_statuses: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        notes: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        content_status: z.string().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        content_id: z.string().uuid().optional(),
        notes: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        content_status: z.string().optional(),
      })
      .strict()
      .optional(),
  },

  content_tags: {
    inbound: z
      .object({ content_id: z.string().uuid().optional(), tag_id: z.number().int().optional() })
      .strict()
      .optional(),
    outbound: z
      .object({ content_id: z.string().uuid().optional(), tag_id: z.number().optional() })
      .strict()
      .optional(),
  },

  contents: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        content_type: enums.content_type.optional(),
        title: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        url: z.string().optional(),
        rss_url: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        content_type: enums.content_type.optional(),
        title: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        url: z.string().optional(),
        rss_url: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  countries: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        name: z.string().max(100).optional(),
        code: z.string().max(2).optional(),
        code_3: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        code: z.string().optional(),
        code_3: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  customer_payments: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        user_id: z.string().uuid().optional(),
        subscription_id: z.number().int().nullable().optional(),
        payment_provider_id: z.number().int().optional(),
        external_payment_id: z.string().max(255).optional(),
        external_order_id: z.string().max(255).nullable().optional(),
        amount: z.number().optional(),
        currency: z.string().max(3).optional(),
        status: z.string().max(50).optional(),
        method: z.string().max(50).nullable().optional(),
        description: z.string().nullable().optional(),
        fee: z.number().nullable().optional(),
        tax: z.number().nullable().optional(),
        error_code: z.string().max(50).nullable().optional(),
        error_description: z.string().nullable().optional(),
        acquirer_data: z.unknown().nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        order_id: z.string().nullable().optional(),
        invoice_id: z.string().nullable().optional(),
        international: z.boolean().nullable().optional(),
        amount_refunded: z.number().nullable().optional(),
        amount_transferred: z.number().nullable().optional(),
        refund_status: z.string().nullable().optional(),
        captured: z.boolean().nullable().optional(),
        bank: z.string().nullable().optional(),
        wallet: z.string().nullable().optional(),
        vpa: z.string().nullable().optional(),
        error_source: z.string().nullable().optional(),
        error_step: z.string().nullable().optional(),
        error_reason: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        user_id: z.string().uuid().optional(),
        subscription_id: z.number().nullable().optional(),
        payment_provider_id: z.number().optional(),
        external_payment_id: z.string().optional(),
        external_order_id: z.string().nullable().optional(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        status: z.string().optional(),
        method: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        fee: z.number().nullable().optional(),
        tax: z.number().nullable().optional(),
        error_code: z.string().nullable().optional(),
        error_description: z.string().nullable().optional(),
        acquirer_data: z.unknown().nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z.date().nullable().optional(),
        order_id: z.string().nullable().optional(),
        invoice_id: z.string().nullable().optional(),
        international: z.boolean().nullable().optional(),
        amount_refunded: z.number().nullable().optional(),
        amount_transferred: z.number().nullable().optional(),
        refund_status: z.string().nullable().optional(),
        captured: z.boolean().nullable().optional(),
        bank: z.string().nullable().optional(),
        wallet: z.string().nullable().optional(),
        vpa: z.string().nullable().optional(),
        error_source: z.string().nullable().optional(),
        error_step: z.string().nullable().optional(),
        error_reason: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  customer_processed_webhooks: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        event_id: z.string().optional(),
        event_type: z.string().optional(),
        processed_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        event_id: z.string().optional(),
        event_type: z.string().optional(),
        processed_at: z.date().optional(),
      })
      .strict()
      .optional(),
  },

  customer_refunds: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        payment_id: z.number().int().optional(),
        external_refund_id: z.string().max(255).optional(),
        amount: z.number().optional(),
        status: z.string().max(50).optional(),
        speed_processed: z.string().max(20).nullable().optional(),
        speed_requested: z.string().max(20).nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        currency: z.string().nullable().optional(),
        receipt: z.string().nullable().optional(),
        acquirer_data: z.unknown().nullable().optional(),
        batch_id: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        payment_id: z.number().optional(),
        external_refund_id: z.string().optional(),
        amount: z.number().optional(),
        status: z.string().optional(),
        speed_processed: z.string().nullable().optional(),
        speed_requested: z.string().nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z.date().nullable().optional(),
        currency: z.string().nullable().optional(),
        receipt: z.string().nullable().optional(),
        acquirer_data: z.unknown().nullable().optional(),
        batch_id: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  customer_subscription_plans: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        external_plan_id: z.string().max(255).nullable().optional(),
        name: z.string().max(100).optional(),
        description: z.string().nullable().optional(),
        interval: z.number().int().optional(),
        interval_type: z.string().max(20).optional(),
        monthly_amount: z.number().optional(),
        annual_amount: z.number().optional(),
        currency: z.string().max(3).optional(),
        features: z.unknown().nullable().optional(),
        is_active: z.boolean().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        external_plan_id: z.string().nullable().optional(),
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        interval: z.number().optional(),
        interval_type: z.string().optional(),
        monthly_amount: z.number().optional(),
        annual_amount: z.number().optional(),
        currency: z.string().optional(),
        features: z.unknown().nullable().optional(),
        is_active: z.boolean().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  customer_subscriptions: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        user_id: z.string().uuid().optional(),
        plan_id: z.number().int().optional(),
        payment_provider_id: z.number().int().optional(),
        external_subscription_id: z.string().max(255).optional(),
        status: z.string().max(50).optional(),
        quantity: z.number().int().nullable().optional(),
        current_start: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        current_end: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        ended_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        cancel_at_period_end: z.boolean().nullable().optional(),
        total_count: z.number().int().nullable().optional(),
        paid_count: z.number().int().nullable().optional(),
        remaining_count: z.number().int().nullable().optional(),
        auth_attempts: z.number().int().nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        type: z.number().int().nullable().optional(),
        charge_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        start_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        end_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        customer_notify: z.boolean().nullable().optional(),
        expire_by: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        short_url: z.string().nullable().optional(),
        has_scheduled_changes: z.boolean().nullable().optional(),
        change_scheduled_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        source: z.string().nullable().optional(),
        offer_id: z.string().nullable().optional(),
        pause_initiated_by: z.string().nullable().optional(),
        cancel_initiated_by: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        user_id: z.string().uuid().optional(),
        plan_id: z.number().optional(),
        payment_provider_id: z.number().optional(),
        external_subscription_id: z.string().optional(),
        status: z.string().optional(),
        quantity: z.number().nullable().optional(),
        current_start: z.date().optional(),
        current_end: z.date().optional(),
        ended_at: z.date().nullable().optional(),
        cancel_at_period_end: z.boolean().nullable().optional(),
        total_count: z.number().nullable().optional(),
        paid_count: z.number().nullable().optional(),
        remaining_count: z.number().nullable().optional(),
        auth_attempts: z.number().nullable().optional(),
        notes: z.unknown().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        type: z.number().nullable().optional(),
        charge_at: z.date().nullable().optional(),
        start_at: z.date().nullable().optional(),
        end_at: z.date().nullable().optional(),
        customer_notify: z.boolean().nullable().optional(),
        expire_by: z.date().nullable().optional(),
        short_url: z.string().nullable().optional(),
        has_scheduled_changes: z.boolean().nullable().optional(),
        change_scheduled_at: z.date().nullable().optional(),
        source: z.string().nullable().optional(),
        offer_id: z.string().nullable().optional(),
        pause_initiated_by: z.string().nullable().optional(),
        cancel_initiated_by: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  embedding_reviews: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        agent_review: z.boolean().nullable().optional(),
        human_review: z.boolean().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().nullable().optional(),
        agent_review: z.boolean().nullable().optional(),
        human_review: z.boolean().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  feed_categories: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        feed_id: z.string().uuid().nullable().optional(),
        category_id: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        created_at: z.date().optional(),
        feed_id: z.string().uuid().nullable().optional(),
        category_id: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  feedbacks: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        user_id: z.string().uuid().nullable().optional(),
        page_identifier: z.string().max(255).optional(),
        feedback_type: z.string().optional(),
        message: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        device_info: z.string().nullable().optional(),
        resolution_comment: z.string().nullable().optional(),
        feedback_status: enums.feedback_status.nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        user_id: z.string().uuid().nullable().optional(),
        page_identifier: z.string().optional(),
        feedback_type: z.string().optional(),
        message: z.string().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
        device_info: z.string().nullable().optional(),
        resolution_comment: z.string().nullable().optional(),
        feedback_status: enums.feedback_status.nullable().optional(),
      })
      .strict()
      .optional(),
  },

  feeds: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        name: z.string().nullable().optional(),
        user_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        created_at: z.date().optional(),
        name: z.string().nullable().optional(),
        user_id: z.string().uuid().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  follows: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        followed_id: z.string().uuid().optional(),
        followed_entity: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        followed_id: z.string().uuid().optional(),
        followed_entity: z.string().optional(),
        created_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  metric_definitions: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        name: z.string().max(255).optional(),
        description: z.string().nullable().optional(),
        category: z.string().max(50).nullable().optional(),
        type: z.string().max(50).optional(),
        unit: z.string().max(50).nullable().optional(),
        is_dimensional: z.boolean().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        category: z.string().nullable().optional(),
        type: z.string().optional(),
        unit: z.string().nullable().optional(),
        is_dimensional: z.boolean().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  news: {
    inbound: z
      .object({
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        title: z.string().nullable().optional(),
        body: z.string().nullable().optional(),
        category_id: z.unknown().optional(),
        author: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        featured_image: z.string().nullable().optional(),
        has_summary: z.boolean().optional(),
        published_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        url: z.string().optional(),
        hash: z.unknown().nullable().optional(),
        id: z.string().uuid().optional(),
        company_id: z.string().uuid().nullable().optional(),
        failed_count: z.number().int().nullable().optional(),
        scrape_frequency: enums.scrape_frequency.optional(),
        scraped_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        content_status: enums.content_status.optional(),
        keywords: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
        title: z.string().nullable().optional(),
        body: z.string().nullable().optional(),
        category_id: z.unknown().optional(),
        author: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        featured_image: z.string().nullable().optional(),
        has_summary: z.boolean().optional(),
        published_at: z.date().nullable().optional(),
        url: z.string().optional(),
        hash: z.unknown().nullable().optional(),
        id: z.string().uuid().optional(),
        company_id: z.string().uuid().nullable().optional(),
        failed_count: z.number().nullable().optional(),
        scrape_frequency: enums.scrape_frequency.optional(),
        scraped_at: z.date().nullable().optional(),
        content_status: enums.content_status.optional(),
        keywords: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  news_summaries: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        summary: z.string().nullable().optional(),
        embedding: z.string().optional(),
        news_id: z.string().uuid().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        summary: z.string().nullable().optional(),
        embedding: z.string().optional(),
        news_id: z.string().uuid().optional(),
      })
      .strict()
      .optional(),
  },

  news_tags: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        news_id: z.unknown().optional(),
        tag_id: z.number().int().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        news_id: z.unknown().optional(),
        tag_id: z.number().optional(),
      })
      .strict()
      .optional(),
  },

  newsletters: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        title: z.string().max(255).optional(),
        frequency: z.string().max(50).optional(),
        start_date: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        end_date: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        generated_content: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        content_status: enums.content_status.optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        title: z.string().optional(),
        frequency: z.string().optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
        generated_content: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        content_status: enums.content_status.optional(),
      })
      .strict()
      .optional(),
  },

  payment_providers: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        name: z.string().max(50).optional(),
        is_active: z.boolean().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        is_active: z.boolean().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  plan_permissions: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        plan: z.string().optional(),
        feature: z.string().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        plan: z.string().optional(),
        feature: z.string().optional(),
      })
      .strict()
      .optional(),
  },

  research: {
    inbound: z
      .object({
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        published_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        title: z.string().nullable().optional(),
        version: z.number().int().nullable().optional(),
        id: z.string().uuid().optional(),
        abstract: z.string().nullable().optional(),
        keywords: z.string().nullable().optional(),
        month: z.string().nullable().optional(),
        year: z.string().nullable().optional(),
        abstract_url: z.string().optional(),
        category: z.string().nullable().optional(),
        doi_url: z.string().nullable().optional(),
        figure_count: z.number().int().nullable().optional(),
        has_embedding: z.boolean().nullable().optional(),
        page_count: z.number().int().nullable().optional(),
        pdf_url: z.string().nullable().optional(),
        published_in: z.string().nullable().optional(),
        table_count: z.number().int().nullable().optional(),
        comments: z.string().nullable().optional(),
        is_flagged: z.boolean().optional(),
        authors: z.unknown().nullable().optional(),
        summary: z.string().nullable().optional(),
        content_status: enums.content_status.optional(),
        affiliations: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        created_at: z.date().optional(),
        updated_at: z.date().nullable().optional(),
        published_at: z.date().nullable().optional(),
        title: z.string().nullable().optional(),
        version: z.number().nullable().optional(),
        id: z.string().uuid().optional(),
        abstract: z.string().nullable().optional(),
        keywords: z.string().nullable().optional(),
        month: z.string().nullable().optional(),
        year: z.string().nullable().optional(),
        abstract_url: z.string().optional(),
        category: z.string().nullable().optional(),
        doi_url: z.string().nullable().optional(),
        figure_count: z.number().nullable().optional(),
        has_embedding: z.boolean().nullable().optional(),
        page_count: z.number().nullable().optional(),
        pdf_url: z.string().nullable().optional(),
        published_in: z.string().nullable().optional(),
        table_count: z.number().nullable().optional(),
        comments: z.string().nullable().optional(),
        is_flagged: z.boolean().optional(),
        authors: z.unknown().nullable().optional(),
        summary: z.string().nullable().optional(),
        content_status: enums.content_status.optional(),
        affiliations: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  research_embeddings: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        research_id: z.string().uuid().optional(),
        chunk: z.string().optional(),
        url: z.string().nullable().optional(),
        embedding: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        is_flagged: z.boolean().nullable().optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        embedding_review_id: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        research_id: z.string().uuid().optional(),
        chunk: z.string().optional(),
        url: z.string().nullable().optional(),
        embedding: z.string().optional(),
        created_at: z.date().nullable().optional(),
        is_flagged: z.boolean().nullable().optional(),
        updated_at: z.date().optional(),
        embedding_review_id: z.unknown().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  responses: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        search_id: z.unknown().optional(),
        output: z.string().optional(),
        upvotes: z.number().int().nullable().optional(),
        downvotes: z.number().int().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        search_id: z.unknown().optional(),
        output: z.string().optional(),
        upvotes: z.number().nullable().optional(),
        downvotes: z.number().nullable().optional(),
        created_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  role_hierarchy: {
    inbound: z
      .object({ parent_role: z.string().optional(), child_role: z.string().optional() })
      .strict()
      .optional(),
    outbound: z
      .object({ parent_role: z.string().optional(), child_role: z.string().optional() })
      .strict()
      .optional(),
  },

  role_permissions: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        role: z.string().optional(),
        table_name: z.string().optional(),
        conditions: z.unknown().nullable().optional(),
        permissions: z.unknown().nullable().optional(),
        select: z.boolean().optional(),
        update: z.boolean().optional(),
        inherit_from: z
          .array(z.string())
          .transform((val) => val.join(','))
          .nullable()
          .optional(),
        cached_permissions: z.unknown().nullable().optional(),
        last_updated: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        role: z.string().optional(),
        table_name: z.string().optional(),
        conditions: z.unknown().nullable().optional(),
        permissions: z.unknown().nullable().optional(),
        select: z.boolean().optional(),
        update: z.boolean().optional(),
        inherit_from: z
          .union([z.array(z.string()).optional(), z.string().optional()])
          .optional()
          .nullable()
          .optional(),
        cached_permissions: z.unknown().nullable().optional(),
        last_updated: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  searches: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        input: z.string().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        embedding: z.string().optional(),
        tokens_used: z.number().int().nullable().optional(),
        user_ids: z
          .array(z.string())
          .transform((val) => val.join(','))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        input: z.string().optional(),
        created_at: z.date().nullable().optional(),
        embedding: z.string().optional(),
        tokens_used: z.number().nullable().optional(),
        user_ids: z
          .union([z.array(z.string().uuid().nullable()).optional(), z.string().optional()])
          .optional()
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
  },

  social_media: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        facebook_url: z.string().max(255).nullable().optional(),
        twitter_url: z.string().max(255).nullable().optional(),
        linkedin_url: z.string().max(255).nullable().optional(),
        instagram_url: z.string().max(255).nullable().optional(),
        youtube_url: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        facebook_url: z.string().nullable().optional(),
        twitter_url: z.string().nullable().optional(),
        linkedin_url: z.string().nullable().optional(),
        instagram_url: z.string().nullable().optional(),
        youtube_url: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  spider_metrics: {
    inbound: z
      .object({
        id: z.unknown().optional(),
        crawl_id: z.string().uuid().optional(),
        metric_id: z.number().int().nullable().optional(),
        timestamp: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
        value: z.unknown().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.unknown().optional(),
        crawl_id: z.string().uuid().optional(),
        metric_id: z.number().nullable().optional(),
        timestamp: z.date().optional(),
        value: z.unknown().optional(),
      })
      .strict()
      .optional(),
  },
  table_maintenance_log: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        operation: z.string().nullable().optional(),
        detail: z.string().nullable().optional(),
        logged_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        operation: z.string().nullable().optional(),
        detail: z.string().nullable().optional(),
        logged_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  table_query_performance: {
    inbound: z
      .object({
        query: z.string().nullable().optional(),
        avg_duration: z.string().nullable().optional(),
        execution_count: z.unknown().nullable().optional(),
        capture_time: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        query: z.string().nullable().optional(),
        avg_duration: z.string().nullable().optional(),
        execution_count: z.unknown().nullable().optional(),
        capture_time: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  table_sequence_usage: {
    inbound: z
      .object({
        sequence_name: z.string().nullable().optional(),
        current_value: z.unknown().nullable().optional(),
        max_value: z.unknown().nullable().optional(),
        capture_time: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        sequence_name: z.string().nullable().optional(),
        current_value: z.unknown().nullable().optional(),
        max_value: z.unknown().nullable().optional(),
        capture_time: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  table_statistics: {
    inbound: z
      .object({
        table_name: z.string().optional(),
        row_count: z.unknown().nullable().optional(),
        table_size: z.unknown().nullable().optional(),
        index_size: z.unknown().nullable().optional(),
        live_tuples: z.unknown().nullable().optional(),
        dead_tuples: z.unknown().nullable().optional(),
        last_vacuum: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        last_analyze: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        estimated_bloat_ratio: z.number().nullable().optional(),
        buffer_cache_hit_ratio: z.number().nullable().optional(),
        index_usage: z.unknown().nullable().optional(),
        seq_scan_count: z.unknown().nullable().optional(),
        index_scan_count: z.unknown().nullable().optional(),
        capture_time: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        table_name: z.string().optional(),
        row_count: z.unknown().nullable().optional(),
        table_size: z.unknown().nullable().optional(),
        index_size: z.unknown().nullable().optional(),
        live_tuples: z.unknown().nullable().optional(),
        dead_tuples: z.unknown().nullable().optional(),
        last_vacuum: z.date().nullable().optional(),
        last_analyze: z.date().nullable().optional(),
        estimated_bloat_ratio: z.number().nullable().optional(),
        buffer_cache_hit_ratio: z.number().nullable().optional(),
        index_usage: z.unknown().nullable().optional(),
        seq_scan_count: z.unknown().nullable().optional(),
        index_scan_count: z.unknown().nullable().optional(),
        capture_time: z.date().optional(),
      })
      .strict()
      .optional(),
  },

  tags: {
    inbound: z
      .object({
        id: z.number().int().optional(),
        body: z.string().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        name: z.string().optional(),
        document_id: z.string().max(255).nullable().optional(),
        locale: z.string().max(255).nullable().optional(),
        published_at: z.string().max(255).nullable().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.number().optional(),
        body: z.string().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        name: z.string().optional(),
        document_id: z.string().nullable().optional(),
        locale: z.string().nullable().optional(),
        published_at: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  },

  user_followers: {
    inbound: z
      .object({
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        user_id: z.string().uuid().optional(),
        followed_id: z.string().uuid().optional(),
        id: z.string().uuid().optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        created_at: z.date().nullable().optional(),
        user_id: z.string().uuid().optional(),
        followed_id: z.string().uuid().optional(),
        id: z.string().uuid().optional(),
      })
      .strict()
      .optional(),
  },

  user_profiles: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        email: z.string().optional(),
        given_name: z.string().nullable().optional(),
        surname: z.string().nullable().optional(),
        username: z.string().nullable().optional(),
        dob: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        gender_id: z.number().int().nullable().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        updated_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        last_seen: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
        avatar: z.string().nullable().optional(),
        introduction: z.string().nullable().optional(),
        followed_count: z.number().int().nullable().optional(),
        followers_count: z.number().int().nullable().optional(),
        plan: enums.app_plan_enum.nullable().optional(),
        role: enums.app_role_enum.optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        email: z.string().optional(),
        given_name: z.string().nullable().optional(),
        surname: z.string().nullable().optional(),
        username: z.string().nullable().optional(),
        dob: z.date().nullable().optional(),
        gender_id: z.number().nullable().optional(),
        created_at: z.date().nullable().optional(),
        updated_at: z.date().nullable().optional(),
        last_seen: z.date().nullable().optional(),
        avatar: z.string().nullable().optional(),
        introduction: z.string().nullable().optional(),
        followed_count: z.number().nullable().optional(),
        followers_count: z.number().nullable().optional(),
        plan: enums.app_plan_enum.nullable().optional(),
        role: enums.app_role_enum.optional(),
      })
      .strict()
      .optional(),
  },

  votes: {
    inbound: z
      .object({
        id: z.string().uuid().optional(),
        content_type: z.string().optional(),
        content_id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        vote_type: z.number().int().optional(),
        created_at: z
          .union([
            z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
            z.date(),
          ])
          .transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val))
          .nullable()
          .optional(),
      })
      .strict()
      .optional(),
    outbound: z
      .object({
        id: z.string().uuid().optional(),
        content_type: z.string().optional(),
        content_id: z.string().uuid().optional(),
        user_id: z.string().uuid().optional(),
        vote_type: z.number().optional(),
        created_at: z.date().nullable().optional(),
      })
      .strict()
      .optional(),
  },
}

export type Schemas = typeof tables
export type SchemaKey = keyof Schemas
export type InboundTableSchema<T extends SchemaKey> = z.infer<NonNullable<Schemas[T]['inbound']>>
export type OutboundTableSchema<T extends SchemaKey> = z.infer<NonNullable<Schemas[T]['outbound']>>

export const getSchema = <T extends SchemaKey>(tableName: T): Schemas[T] => tables[tableName]
