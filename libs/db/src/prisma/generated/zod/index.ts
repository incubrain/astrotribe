import { z } from 'zod';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AdDailyMetricsScalarFieldEnumSchema = z.enum(['id','variant_id','date','views','clicks','created_at','updated_at']);

export const AdPackagesScalarFieldEnumSchema = z.enum(['id','name','position','active','created_at','updated_at','description','price','features','expected_ctr','avg_roi','view_frequency']);

export const AdVariantsScalarFieldEnumSchema = z.enum(['id','ad_id','content','is_control','active','created_at','updated_at','performance_metrics']);

export const AddressesScalarFieldEnumSchema = z.enum(['id','street1','street2','city_id','country_id','name','user_id','is_primary','address_type','created_at','updated_at','company_id']);

export const AdsScalarFieldEnumSchema = z.enum(['id','company_id','package_id','start_date','end_date','active','created_at','updated_at']);

export const AstronomyEventsScalarFieldEnumSchema = z.enum(['created_at','title','category','date','time','description','id']);

export const BlacklistedDomainsScalarFieldEnumSchema = z.enum(['id','created_at','url','reason']);

export const BlacklistedUrlsScalarFieldEnumSchema = z.enum(['id','url','reason','created_at','company_id']);

export const BlockedIpsScalarFieldEnumSchema = z.enum(['id','ip_address','blocked_at','blocked_until','failed_attempts','reason','created_at','updated_at']);

export const BookmarkFoldersScalarFieldEnumSchema = z.enum(['id','user_id','name','color','parent_id','is_default','is_favorite','position','created_at','updated_at']);

export const BookmarksScalarFieldEnumSchema = z.enum(['id','user_id','content_id','content_type','created_at','folder_id','metadata','updated_at']);

export const BusinessDomainsScalarFieldEnumSchema = z.enum(['id','name','slug','description','parent_id','created_at','updated_at']);

export const CategoriesScalarFieldEnumSchema = z.enum(['id','created_at','updated_at','body','name','document_id','locale','published_at']);

export const CategorizedUrlsScalarFieldEnumSchema = z.enum(['id','domain_id','confidence','categorizer_version','created_at','found_on','url','priority']);

export const CircuitBreakerStatesScalarFieldEnumSchema = z.enum(['id','job_name','state','failure_count','last_failure','last_success','created_at','updated_at']);

export const CitiesScalarFieldEnumSchema = z.enum(['id','name','country_id','state']);

export const CommentsScalarFieldEnumSchema = z.enum(['id','content','user_id','content_id','content_type','parent_comment_id','created_at','updated_at']);

export const CompaniesScalarFieldEnumSchema = z.enum(['name','description','logo_url','url','social_media_id','scrape_frequency','category_id','created_at','updated_at','founding_year','is_government','category','failed_count','is_english','scrape_rating','id','scraped_at','content_status','keywords','job_url']);

export const CompanyContactsScalarFieldEnumSchema = z.enum(['id','contact_id','created_at','updated_at','company_id']);

export const CompanyEmployeesScalarFieldEnumSchema = z.enum(['role','job_description','start_date','end_date','status','access_level','created_at','updated_at','company_id','user_id','id']);

export const CompanyExtrasScalarFieldEnumSchema = z.enum(['id','updated_at','created_at','url','success','category','level','company_id','body','found_count','review']);

export const CompanyMetricsScalarFieldEnumSchema = z.enum(['id','crawl_id','company_id','metric_id','timestamp','value']);

export const ContactsScalarFieldEnumSchema = z.enum(['id','title','is_primary','email','contact_type','privacy_level','user_id','created_at','updated_at','phone','company_id']);

export const ContentCategoriesScalarFieldEnumSchema = z.enum(['content_id','category_id','is_primary']);

export const ContentSourceVisitsScalarFieldEnumSchema = z.enum(['id','content_id','user_id','created_at']);

export const ContentSourcesScalarFieldEnumSchema = z.enum(['id','url','content_type','scrape_frequency','created_at','updated_at','refreshed_at','has_failed','failed_count','priority','hash','scraped_at','expected_count','company_id','rss_urls']);

export const ContentStatusesScalarFieldEnumSchema = z.enum(['id','content_id','notes','created_at','content_status']);

export const ContentTagsScalarFieldEnumSchema = z.enum(['content_id','tag_id']);

export const ContentsScalarFieldEnumSchema = z.enum(['id','content_type','title','created_at','updated_at','url','hot_score','rss_url']);

export const CountriesScalarFieldEnumSchema = z.enum(['id','name','code','code_3']);

export const CustomerPaymentsScalarFieldEnumSchema = z.enum(['id','user_id','subscription_id','payment_provider_id','external_payment_id','external_order_id','amount','currency','status','method','description','fee','tax','error_code','error_description','acquirer_data','notes','created_at','order_id','invoice_id','international','amount_refunded','amount_transferred','refund_status','captured','bank','wallet','vpa','error_source','error_step','error_reason']);

export const CustomerProcessedWebhooksScalarFieldEnumSchema = z.enum(['id','event_id','event_type','processed_at']);

export const CustomerRefundsScalarFieldEnumSchema = z.enum(['id','payment_id','external_refund_id','amount','status','speed_processed','speed_requested','notes','created_at','currency','receipt','acquirer_data','batch_id']);

export const CustomerSubscriptionOffersScalarFieldEnumSchema = z.enum(['id','plan_id','is_active','created_at','updated_at','discount','discount_type','discount_period','already_discounted','expiry_date']);

export const CustomerSubscriptionPlansScalarFieldEnumSchema = z.enum(['id','external_plan_id','name','description','interval','interval_type','monthly_amount','annual_amount','currency','features','is_active','created_at','updated_at']);

export const CustomerSubscriptionsScalarFieldEnumSchema = z.enum(['id','user_id','plan_id','payment_provider_id','external_subscription_id','status','quantity','current_start','current_end','ended_at','cancel_at_period_end','total_count','paid_count','remaining_count','auth_attempts','notes','created_at','updated_at','type','charge_at','start_at','end_at','customer_notify','expire_by','short_url','has_scheduled_changes','change_scheduled_at','source','offer_id','pause_initiated_by','cancel_initiated_by']);

export const EmbeddingReviewsScalarFieldEnumSchema = z.enum(['id','created_at','updated_at','agent_review','human_review','notes']);

export const ErrorLogsScalarFieldEnumSchema = z.enum(['id','service_name','error_type','severity','message','stack_trace','metadata','context','user_id','request_id','correlation_id','environment','created_at','error_hash','error_pattern','is_new_pattern','github_repo','related_errors','frequency_data','domain']);

export const FeatureRequestsScalarFieldEnumSchema = z.enum(['id','title','description','status','created_at','updated_at','downvotes','engagement_score','priority_score','upvotes']);

export const FeatureVotesScalarFieldEnumSchema = z.enum(['id','feature_id','user_id','vote_type','feedback','created_at','updated_at']);

export const FeedCategoriesScalarFieldEnumSchema = z.enum(['id','created_at','feed_id','category_id']);

export const FeedSourcesScalarFieldEnumSchema = z.enum(['id','feed_id','created_at','content_source_id']);

export const FeedbacksScalarFieldEnumSchema = z.enum(['id','user_id','page_identifier','rating','feedback_type','message','created_at','updated_at','device_info','resolution_comment','feedback_status']);

export const FeedsScalarFieldEnumSchema = z.enum(['id','created_at','name','user_id']);

export const FollowsScalarFieldEnumSchema = z.enum(['id','followed_id','followed_entity','created_at','user_id']);

export const JobsScalarFieldEnumSchema = z.enum(['id','contents_id','title','company_id','location','description','published_at','expires_at','scraped_at','updated_at','created_at','content_status','content_source_id','url','hash','employment_type','metadata']);

export const MetricDefinitionsScalarFieldEnumSchema = z.enum(['id','name','description','category','type','unit','is_dimensional']);

export const NewsScalarFieldEnumSchema = z.enum(['created_at','updated_at','title','body','category_id','author','description','featured_image','has_summary','published_at','url','hash','id','company_id','failed_count','scrape_frequency','scraped_at','content_status','keywords','content_source_id']);

export const NewsSummariesScalarFieldEnumSchema = z.enum(['id','news_id','summary','version','is_current','created_at','updated_at','complexity_level']);

export const NewsTagsScalarFieldEnumSchema = z.enum(['id','tag_id','news_id']);

export const NewslettersScalarFieldEnumSchema = z.enum(['id','title','frequency','start_date','end_date','generated_content','created_at','updated_at','content_status']);

export const PaymentProvidersScalarFieldEnumSchema = z.enum(['id','name','is_active','created_at','updated_at']);

export const PlanPermissionsScalarFieldEnumSchema = z.enum(['id','plan','feature']);

export const ReferralsScalarFieldEnumSchema = z.enum(['id','referrer_code','visitor_id','created_at','converted_at','referral_status','conversion_value','user_agent','ip_address','landing_page','utm_source','utm_medium','utm_campaign','device_type','browser','country_code','region','is_suspicious','security_flags','validation_attempts','last_failed_attempt','client_fingerprint']);

export const ReferrerBlocksScalarFieldEnumSchema = z.enum(['id','referrer_code','blocked_at','blocked_by','reason','is_permanent','created_at','updated_at']);

export const ResearchScalarFieldEnumSchema = z.enum(['created_at','updated_at','published_at','title','version','id','abstract','keywords','month','year','abstract_url','category','doi_url','figure_count','has_embedding','page_count','pdf_url','published_in','table_count','comments','is_flagged','authors','summary','content_status','affiliations']);

export const ResearchEmbeddingsScalarFieldEnumSchema = z.enum(['id','research_id','chunk','url','created_at','is_flagged','updated_at','embedding_review_id']);

export const ResponsesScalarFieldEnumSchema = z.enum(['id','search_id','output','upvotes','downvotes','created_at']);

export const RoleHierarchyScalarFieldEnumSchema = z.enum(['parent_role','child_role']);

export const RolePermissionsScalarFieldEnumSchema = z.enum(['id','role','table_name','conditions','permissions','cached_permissions','inherit_from','last_updated']);

export const RolePermissionsMaterializedScalarFieldEnumSchema = z.enum(['role','permissions','last_updated']);

export const ScoringWeightsScalarFieldEnumSchema = z.enum(['id','name','weight','description','updated_at']);

export const SearchesScalarFieldEnumSchema = z.enum(['id','input','created_at','tokens_used','user_ids']);

export const SocialMediaScalarFieldEnumSchema = z.enum(['id','facebook_url','twitter_url','linkedin_url','instagram_url','youtube_url','created_at','updated_at']);

export const SpiderMetricsScalarFieldEnumSchema = z.enum(['id','crawl_id','metric_id','timestamp','value']);

export const TableMaintenanceLogScalarFieldEnumSchema = z.enum(['id','operation','detail','logged_at']);

export const TableStatisticsScalarFieldEnumSchema = z.enum(['table_name','row_count','table_size','index_size','live_tuples','dead_tuples','last_vacuum','last_analyze','estimated_bloat_ratio','buffer_cache_hit_ratio','index_usage','seq_scan_count','index_scan_count','capture_time']);

export const TagsScalarFieldEnumSchema = z.enum(['id','body','name','document_id','locale','published_at','created_at','updated_at']);

export const UserMetricsScalarFieldEnumSchema = z.enum(['id','user_id','total_votes','upvote_count','downvote_count','vote_accuracy','current_streak','best_streak','today_vote_count','total_reading_time','last_vote_date','points','points_breakdown','interaction_stats','achievements','titles','multipliers','current_level','current_xp','xp_to_next_level','created_at','updated_at']);

export const UserProfilesScalarFieldEnumSchema = z.enum(['id','email','given_name','surname','username','dob','gender_id','created_at','updated_at','last_seen','avatar','introduction','followed_count','followers_count','plan','role','is_active']);

export const VotesScalarFieldEnumSchema = z.enum(['id','content_type','content_id','user_id','vote_type','created_at']);

export const WorkflowsScalarFieldEnumSchema = z.enum(['id','name','status','metadata','started_at','completed_at','created_at','updated_at']);

export const UsersScalarFieldEnumSchema = z.enum(['id']);

export const Security_metricsScalarFieldEnumSchema = z.enum(['time_bucket','total_attempts','suspicious_attempts','unique_ips','unique_referrers','high_attempt_count','max_attempts']);

export const Error_frequencyScalarFieldEnumSchema = z.enum(['service_name','error_type','severity','time_bucket','error_count']);

export const Error_statsScalarFieldEnumSchema = z.enum(['calls','mean_exec_time','max_exec_time','rows','query','queryid','toplevel']);

export const Recent_errorsScalarFieldEnumSchema = z.enum(['id','created_at','service_name','error_type','severity','message','metadata']);

export const Slow_query_patternsScalarFieldEnumSchema = z.enum(['query_id','occurrence_count','avg_exec_time','max_exec_time','first_seen','last_seen']);

export const Error_metricsScalarFieldEnumSchema = z.enum(['time_bucket','service_name','error_type','severity','error_count']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const AccessLevelSchema = z.enum(['viewer','editor','admin','super_admin']);

export type AccessLevelType = `${z.infer<typeof AccessLevelSchema>}`

export const AddressTypeSchema = z.enum(['residential','headquarters','office','factory','lab','warehouse','research','retail','showroom','branch']);

export type AddressTypeType = `${z.infer<typeof AddressTypeSchema>}`

export const AppPlanEnumSchema = z.enum(['free','basic','intermediate','premium','enterprise','custom']);

export type AppPlanEnumType = `${z.infer<typeof AppPlanEnumSchema>}`

export const AppRoleEnumSchema = z.enum(['guest','user','astroguide','mentor','moderator','tenant_member','tenant_admin','tenant_super_admin','admin','super_admin','service_role']);

export type AppRoleEnumType = `${z.infer<typeof AppRoleEnumSchema>}`

export const ComplexityLevelSchema = z.enum(['beginner','intermediate','expert','undefined']);

export type ComplexityLevelType = `${z.infer<typeof ComplexityLevelSchema>}`

export const ContactTypeSchema = z.enum(['personal','company','professional','recruitment','founder']);

export type ContactTypeType = `${z.infer<typeof ContactTypeSchema>}`

export const ContentStatusSchema = z.enum(['draft','pending_agent_action','pending_agent_review','pending_human_review','pending_relevance_check','irrelevant','scheduled','unpublished','archived','published','failed','pending_crawl','scraped','outdated','updated','new']);

export type ContentStatusType = `${z.infer<typeof ContentStatusSchema>}`

export const ContentTypeSchema = z.enum(['news','events','jobs','research','companies','contact','people','newsletters','unknown']);

export type ContentTypeType = `${z.infer<typeof ContentTypeSchema>}`

export const DiscountPeriodSchema = z.enum(['yearly','monthly','once']);

export type DiscountPeriodType = `${z.infer<typeof DiscountPeriodSchema>}`

export const DiscountTypeSchema = z.enum(['percentage','flat']);

export type DiscountTypeType = `${z.infer<typeof DiscountTypeSchema>}`

export const ErrorSeveritySchema = z.enum(['low','medium','high','critical']);

export type ErrorSeverityType = `${z.infer<typeof ErrorSeveritySchema>}`

export const ErrorTypeSchema = z.enum(['UPLOAD_ERROR','CONNECTION_ERROR','AUTHENTICATION_ERROR','VALIDATION_ERROR','NOT_FOUND_ERROR','SERVER_ERROR','NETWORK_ERROR','DATABASE_ERROR','UNKNOWN_ERROR','SLOW_QUERY','ERROR_SPIKE','AUTH_ERROR','TABLE_ERROR','TABLE_OPERATION']);

export type ErrorTypeType = `${z.infer<typeof ErrorTypeSchema>}`

export const FeedbackStatusSchema = z.enum(['new','under_review','backlog','working_on','resolved','rejected','deferred']);

export type FeedbackStatusType = `${z.infer<typeof FeedbackStatusSchema>}`

export const FeedbackTypeSchema = z.enum(['bug_report','feature_request','user_interface_issue','performance_issue','documentation']);

export type FeedbackTypeType = `${z.infer<typeof FeedbackTypeSchema>}`

export const FollowedEntitySchema = z.enum(['company','user']);

export type FollowedEntityType = `${z.infer<typeof FollowedEntitySchema>}`

export const JobPrioritySchema = z.enum(['critical','high','normal','low']);

export type JobPriorityType = `${z.infer<typeof JobPrioritySchema>}`

export const JobStatusSchema = z.enum(['created','active','completed','failed','cancelled','expired']);

export type JobStatusType = `${z.infer<typeof JobStatusSchema>}`

export const NewsImportanceLevelSchema = z.enum(['high','medium','low']);

export type NewsImportanceLevelType = `${z.infer<typeof NewsImportanceLevelSchema>}`

export const NewsRelationTypeSchema = z.enum(['source','topic','mention']);

export type NewsRelationTypeType = `${z.infer<typeof NewsRelationTypeSchema>}`

export const PrioritySchema = z.enum(['very_low','low','medium','high','critical']);

export type PriorityType = `${z.infer<typeof PrioritySchema>}`

export const PrivacyLevelSchema = z.enum(['private','connected','public']);

export type PrivacyLevelType = `${z.infer<typeof PrivacyLevelSchema>}`

export const ReferralStatusSchema = z.enum(['pending','converted','abandoned']);

export type ReferralStatusType = `${z.infer<typeof ReferralStatusSchema>}`

export const ScrapeFrequencySchema = z.enum(['four_times_daily','twice_daily','daily','twice_weekly','weekly','bi_weekly','monthly','quarterly','biannual','annually','never']);

export type ScrapeFrequencyType = `${z.infer<typeof ScrapeFrequencySchema>}`

export const UserStatusSchema = z.enum(['online','offline']);

export type UserStatusType = `${z.infer<typeof UserStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// AD DAILY METRICS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="ad_daily_metrics"
 */
export const AdDailyMetricsSchema = z.object({
  id: z.string(),
  variant_id: z.string().nullable(),
  date: z.coerce.date(),
  views: z.number().int().nullable(),
  clicks: z.number().int().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type AdDailyMetrics = z.infer<typeof AdDailyMetricsSchema>

/////////////////////////////////////////
// AD PACKAGES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="ad_packages"
 */
export const AdPackagesSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  active: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  description: z.string(),
  price: z.instanceof(Prisma.Decimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'AdPackages']"}),
  features: z.string().array(),
  expected_ctr: z.instanceof(Prisma.Decimal, { message: "Field 'expected_ctr' must be a Decimal. Location: ['Models', 'AdPackages']"}).nullable(),
  avg_roi: z.instanceof(Prisma.Decimal, { message: "Field 'avg_roi' must be a Decimal. Location: ['Models', 'AdPackages']"}).nullable(),
  view_frequency: z.instanceof(Prisma.Decimal, { message: "Field 'view_frequency' must be a Decimal. Location: ['Models', 'AdPackages']"}).nullable(),
})

export type AdPackages = z.infer<typeof AdPackagesSchema>

/////////////////////////////////////////
// AD VARIANTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="ad_variants"
 */
export const AdVariantsSchema = z.object({
  id: z.string(),
  ad_id: z.string(),
  content: JsonValueSchema,
  is_control: z.boolean().nullable(),
  active: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  performance_metrics: JsonValueSchema.nullable(),
})

export type AdVariants = z.infer<typeof AdVariantsSchema>

/////////////////////////////////////////
// ADDRESSES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="addresses"
 */
export const AddressesSchema = z.object({
  address_type: AddressTypeSchema.nullable(),
  id: z.number().int(),
  street1: z.string(),
  street2: z.string().nullable(),
  city_id: z.number().int(),
  country_id: z.number().int(),
  name: z.string().nullable(),
  user_id: z.string().nullable(),
  is_primary: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  company_id: z.string().nullable(),
})

export type Addresses = z.infer<typeof AddressesSchema>

/////////////////////////////////////////
// ADS SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="ads"
 */
export const AdsSchema = z.object({
  id: z.string(),
  company_id: z.string().nullable(),
  package_id: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  active: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Ads = z.infer<typeof AdsSchema>

/////////////////////////////////////////
// ASTRONOMY EVENTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="astronomy_events"
 */
export const AstronomyEventsSchema = z.object({
  created_at: z.coerce.date(),
  title: z.string(),
  category: z.string().nullable(),
  date: z.string().nullable(),
  time: z.string().nullable(),
  description: z.string().nullable(),
  id: z.string(),
})

export type AstronomyEvents = z.infer<typeof AstronomyEventsSchema>

/////////////////////////////////////////
// BLACKLISTED DOMAINS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="blacklisted_domains"
 */
export const BlacklistedDomainsSchema = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  url: z.string(),
  reason: z.string().nullable(),
})

export type BlacklistedDomains = z.infer<typeof BlacklistedDomainsSchema>

/////////////////////////////////////////
// BLACKLISTED URLS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="blacklisted_urls"
 */
export const BlacklistedUrlsSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  reason: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  company_id: z.string().nullable(),
})

export type BlacklistedUrls = z.infer<typeof BlacklistedUrlsSchema>

/////////////////////////////////////////
// BLOCKED IPS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="blocked_ips"
 */
export const BlockedIpsSchema = z.object({
  id: z.string(),
  ip_address: z.string(),
  blocked_at: z.coerce.date().nullable(),
  blocked_until: z.coerce.date(),
  failed_attempts: z.number().int().nullable(),
  reason: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type BlockedIps = z.infer<typeof BlockedIpsSchema>

/////////////////////////////////////////
// BOOKMARK FOLDERS SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="bookmark_folders"
 */
export const BookmarkFoldersSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  parent_id: z.string().nullable(),
  is_default: z.boolean().nullable(),
  is_favorite: z.boolean().nullable(),
  position: z.number().int().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type BookmarkFolders = z.infer<typeof BookmarkFoldersSchema>

/////////////////////////////////////////
// BOOKMARKS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="bookmarks"
 */
export const BookmarksSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  content_id: z.string(),
  content_type: z.string(),
  created_at: z.coerce.date().nullable(),
  folder_id: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Bookmarks = z.infer<typeof BookmarksSchema>

/////////////////////////////////////////
// BUSINESS DOMAINS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="business_domains"
 */
export const BusinessDomainsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parent_id: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type BusinessDomains = z.infer<typeof BusinessDomainsSchema>

/////////////////////////////////////////
// CATEGORIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="categories"
 */
export const CategoriesSchema = z.object({
  id: z.bigint(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  body: z.string().nullable(),
  name: z.string(),
  document_id: z.string().nullable(),
  locale: z.string().nullable(),
  published_at: z.string().nullable(),
})

export type Categories = z.infer<typeof CategoriesSchema>

/////////////////////////////////////////
// CATEGORIZED URLS SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="categorized_urls"
 */
export const CategorizedUrlsSchema = z.object({
  id: z.string(),
  domain_id: z.string(),
  confidence: z.instanceof(Prisma.Decimal, { message: "Field 'confidence' must be a Decimal. Location: ['Models', 'CategorizedUrls']"}),
  categorizer_version: z.string(),
  created_at: z.coerce.date().nullable(),
  found_on: z.string(),
  url: z.string(),
  priority: z.number().int(),
})

export type CategorizedUrls = z.infer<typeof CategorizedUrlsSchema>

/////////////////////////////////////////
// CIRCUIT BREAKER STATES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="circuit_breaker_states"
 */
export const CircuitBreakerStatesSchema = z.object({
  id: z.string(),
  job_name: z.string(),
  state: z.string(),
  failure_count: z.number().int().nullable(),
  last_failure: z.coerce.date().nullable(),
  last_success: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type CircuitBreakerStates = z.infer<typeof CircuitBreakerStatesSchema>

/////////////////////////////////////////
// CITIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="cities"
 */
export const CitiesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  country_id: z.number().int(),
  state: z.string().nullable(),
})

export type Cities = z.infer<typeof CitiesSchema>

/////////////////////////////////////////
// COMMENTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="comments"
 */
export const CommentsSchema = z.object({
  content_type: ContentTypeSchema,
  id: z.string(),
  content: z.string(),
  user_id: z.string(),
  content_id: z.string(),
  parent_comment_id: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Comments = z.infer<typeof CommentsSchema>

/////////////////////////////////////////
// COMPANIES SCHEMA
/////////////////////////////////////////

/**
 * This model contains an index with non-default null sort order and requires additional setup for migrations. Visit https://pris.ly/d/default-index-null-ordering for more info.
 * @client.name="companies"
 */
export const CompaniesSchema = z.object({
  scrape_frequency: ScrapeFrequencySchema.nullable(),
  content_status: ContentStatusSchema,
  name: z.string().nullable(),
  description: z.string().nullable(),
  logo_url: z.string().nullable(),
  url: z.string(),
  social_media_id: z.number().int().nullable(),
  category_id: z.bigint().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  founding_year: z.number().int().nullable(),
  is_government: z.boolean().nullable(),
  category: z.string().nullable(),
  failed_count: z.number().int().nullable(),
  is_english: z.boolean().nullable(),
  scrape_rating: z.number().int().nullable(),
  id: z.string(),
  scraped_at: z.coerce.date().nullable(),
  keywords: JsonValueSchema.nullable(),
  job_url: z.string().nullable(),
})

export type Companies = z.infer<typeof CompaniesSchema>

/////////////////////////////////////////
// COMPANY CONTACTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="company_contacts"
 */
export const CompanyContactsSchema = z.object({
  id: z.number().int(),
  contact_id: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  company_id: z.string().nullable(),
})

export type CompanyContacts = z.infer<typeof CompanyContactsSchema>

/////////////////////////////////////////
// COMPANY EMPLOYEES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="company_employees"
 */
export const CompanyEmployeesSchema = z.object({
  access_level: AccessLevelSchema,
  role: z.string(),
  job_description: z.string().nullable(),
  start_date: z.coerce.date().nullable(),
  end_date: z.coerce.date().nullable(),
  status: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  company_id: z.string().nullable(),
  user_id: z.string(),
  id: z.string(),
})

export type CompanyEmployees = z.infer<typeof CompanyEmployeesSchema>

/////////////////////////////////////////
// COMPANY EXTRAS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="company_extras"
 */
export const CompanyExtrasSchema = z.object({
  id: z.number().int(),
  updated_at: z.coerce.date(),
  created_at: z.coerce.date(),
  url: z.string(),
  success: z.boolean().nullable(),
  category: z.string(),
  level: z.number().int(),
  company_id: z.string().nullable(),
  body: z.string().nullable(),
  found_count: z.number().int().nullable(),
  review: JsonValueSchema.nullable(),
})

export type CompanyExtras = z.infer<typeof CompanyExtrasSchema>

/////////////////////////////////////////
// COMPANY METRICS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="company_metrics"
 */
export const CompanyMetricsSchema = z.object({
  id: z.bigint(),
  crawl_id: z.string(),
  company_id: z.string(),
  metric_id: z.number().int().nullable(),
  timestamp: z.coerce.date(),
  value: JsonValueSchema,
})

export type CompanyMetrics = z.infer<typeof CompanyMetricsSchema>

/////////////////////////////////////////
// CONTACTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="contacts"
 */
export const ContactsSchema = z.object({
  contact_type: ContactTypeSchema.nullable(),
  privacy_level: PrivacyLevelSchema.nullable(),
  id: z.number().int(),
  title: z.string().nullable(),
  is_primary: z.boolean().nullable(),
  email: z.string().nullable(),
  user_id: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  phone: z.string().nullable(),
  company_id: z.string().nullable(),
})

export type Contacts = z.infer<typeof ContactsSchema>

/////////////////////////////////////////
// CONTENT CATEGORIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="content_categories"
 */
export const ContentCategoriesSchema = z.object({
  content_id: z.string(),
  category_id: z.bigint(),
  is_primary: z.boolean(),
})

export type ContentCategories = z.infer<typeof ContentCategoriesSchema>

/////////////////////////////////////////
// CONTENT SOURCE VISITS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="content_source_visits"
 */
export const ContentSourceVisitsSchema = z.object({
  id: z.string(),
  content_id: z.string(),
  user_id: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
})

export type ContentSourceVisits = z.infer<typeof ContentSourceVisitsSchema>

/////////////////////////////////////////
// CONTENT SOURCES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="content_sources"
 */
export const ContentSourcesSchema = z.object({
  content_type: ContentTypeSchema,
  scrape_frequency: ScrapeFrequencySchema,
  priority: PrioritySchema,
  id: z.bigint(),
  url: z.string(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  refreshed_at: z.coerce.date().nullable(),
  has_failed: z.boolean().nullable(),
  failed_count: z.number().int().nullable(),
  hash: z.bigint().nullable(),
  scraped_at: z.coerce.date().nullable(),
  expected_count: z.number().int().nullable(),
  company_id: z.string().nullable(),
  rss_urls: z.string().array(),
})

export type ContentSources = z.infer<typeof ContentSourcesSchema>

/////////////////////////////////////////
// CONTENT STATUSES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="content_statuses"
 */
export const ContentStatusesSchema = z.object({
  content_status: ContentStatusSchema,
  id: z.string(),
  content_id: z.string(),
  notes: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
})

export type ContentStatuses = z.infer<typeof ContentStatusesSchema>

/////////////////////////////////////////
// CONTENT TAGS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="content_tags"
 */
export const ContentTagsSchema = z.object({
  content_id: z.string(),
  tag_id: z.number().int(),
})

export type ContentTags = z.infer<typeof ContentTagsSchema>

/////////////////////////////////////////
// CONTENTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="contents"
 */
export const ContentsSchema = z.object({
  content_type: ContentTypeSchema,
  id: z.string(),
  title: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  url: z.string(),
  hot_score: z.number().nullable(),
  rss_url: z.string().nullable(),
})

export type Contents = z.infer<typeof ContentsSchema>

/////////////////////////////////////////
// COUNTRIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="countries"
 */
export const CountriesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
  code_3: z.string().nullable(),
})

export type Countries = z.infer<typeof CountriesSchema>

/////////////////////////////////////////
// CUSTOMER PAYMENTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_payments"
 */
export const CustomerPaymentsSchema = z.object({
  id: z.number().int(),
  user_id: z.string(),
  subscription_id: z.number().int().nullable(),
  payment_provider_id: z.number().int(),
  external_payment_id: z.string(),
  external_order_id: z.string().nullable(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'CustomerPayments']"}),
  currency: z.string(),
  status: z.string(),
  method: z.string().nullable(),
  description: z.string().nullable(),
  fee: z.instanceof(Prisma.Decimal, { message: "Field 'fee' must be a Decimal. Location: ['Models', 'CustomerPayments']"}).nullable(),
  tax: z.instanceof(Prisma.Decimal, { message: "Field 'tax' must be a Decimal. Location: ['Models', 'CustomerPayments']"}).nullable(),
  error_code: z.string().nullable(),
  error_description: z.string().nullable(),
  acquirer_data: JsonValueSchema.nullable(),
  notes: JsonValueSchema.nullable(),
  created_at: z.coerce.date().nullable(),
  order_id: z.string().nullable(),
  invoice_id: z.string().nullable(),
  international: z.boolean().nullable(),
  amount_refunded: z.instanceof(Prisma.Decimal, { message: "Field 'amount_refunded' must be a Decimal. Location: ['Models', 'CustomerPayments']"}).nullable(),
  amount_transferred: z.instanceof(Prisma.Decimal, { message: "Field 'amount_transferred' must be a Decimal. Location: ['Models', 'CustomerPayments']"}).nullable(),
  refund_status: z.string().nullable(),
  captured: z.boolean().nullable(),
  bank: z.string().nullable(),
  wallet: z.string().nullable(),
  vpa: z.string().nullable(),
  error_source: z.string().nullable(),
  error_step: z.string().nullable(),
  error_reason: z.string().nullable(),
})

export type CustomerPayments = z.infer<typeof CustomerPaymentsSchema>

/////////////////////////////////////////
// CUSTOMER PROCESSED WEBHOOKS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_processed_webhooks"
 */
export const CustomerProcessedWebhooksSchema = z.object({
  id: z.number().int(),
  event_id: z.string(),
  event_type: z.string(),
  processed_at: z.coerce.date(),
})

export type CustomerProcessedWebhooks = z.infer<typeof CustomerProcessedWebhooksSchema>

/////////////////////////////////////////
// CUSTOMER REFUNDS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_refunds"
 */
export const CustomerRefundsSchema = z.object({
  id: z.number().int(),
  payment_id: z.number().int(),
  external_refund_id: z.string(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'CustomerRefunds']"}),
  status: z.string(),
  speed_processed: z.string().nullable(),
  speed_requested: z.string().nullable(),
  notes: JsonValueSchema.nullable(),
  created_at: z.coerce.date().nullable(),
  currency: z.string().nullable(),
  receipt: z.string().nullable(),
  acquirer_data: JsonValueSchema.nullable(),
  batch_id: z.string().nullable(),
})

export type CustomerRefunds = z.infer<typeof CustomerRefundsSchema>

/////////////////////////////////////////
// CUSTOMER SUBSCRIPTION OFFERS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_subscription_offers"
 */
export const CustomerSubscriptionOffersSchema = z.object({
  discount_type: DiscountTypeSchema.nullable(),
  discount_period: DiscountPeriodSchema.nullable(),
  id: z.string(),
  plan_id: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  discount: z.instanceof(Prisma.Decimal, { message: "Field 'discount' must be a Decimal. Location: ['Models', 'CustomerSubscriptionOffers']"}).nullable(),
  already_discounted: z.boolean().nullable(),
  expiry_date: z.coerce.date().nullable(),
})

export type CustomerSubscriptionOffers = z.infer<typeof CustomerSubscriptionOffersSchema>

/////////////////////////////////////////
// CUSTOMER SUBSCRIPTION PLANS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_subscription_plans"
 */
export const CustomerSubscriptionPlansSchema = z.object({
  id: z.number().int(),
  external_plan_id: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  interval: z.number().int(),
  interval_type: z.string(),
  monthly_amount: z.instanceof(Prisma.Decimal, { message: "Field 'monthly_amount' must be a Decimal. Location: ['Models', 'CustomerSubscriptionPlans']"}),
  annual_amount: z.instanceof(Prisma.Decimal, { message: "Field 'annual_amount' must be a Decimal. Location: ['Models', 'CustomerSubscriptionPlans']"}),
  currency: z.string(),
  features: JsonValueSchema.nullable(),
  is_active: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type CustomerSubscriptionPlans = z.infer<typeof CustomerSubscriptionPlansSchema>

/////////////////////////////////////////
// CUSTOMER SUBSCRIPTIONS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="customer_subscriptions"
 */
export const CustomerSubscriptionsSchema = z.object({
  id: z.number().int(),
  user_id: z.string(),
  plan_id: z.number().int(),
  payment_provider_id: z.number().int(),
  external_subscription_id: z.string(),
  status: z.string(),
  quantity: z.number().int().nullable(),
  current_start: z.coerce.date().nullable(),
  current_end: z.coerce.date().nullable(),
  ended_at: z.coerce.date().nullable(),
  cancel_at_period_end: z.boolean().nullable(),
  total_count: z.number().int().nullable(),
  paid_count: z.number().int().nullable(),
  remaining_count: z.number().int().nullable(),
  auth_attempts: z.number().int().nullable(),
  notes: JsonValueSchema.nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  type: z.number().int().nullable(),
  charge_at: z.coerce.date().nullable(),
  start_at: z.coerce.date().nullable(),
  end_at: z.coerce.date().nullable(),
  customer_notify: z.boolean().nullable(),
  expire_by: z.coerce.date().nullable(),
  short_url: z.string().nullable(),
  has_scheduled_changes: z.boolean().nullable(),
  change_scheduled_at: z.coerce.date().nullable(),
  source: z.string().nullable(),
  offer_id: z.string().nullable(),
  pause_initiated_by: z.string().nullable(),
  cancel_initiated_by: z.string().nullable(),
})

export type CustomerSubscriptions = z.infer<typeof CustomerSubscriptionsSchema>

/////////////////////////////////////////
// EMBEDDING REVIEWS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="embedding_reviews"
 */
export const EmbeddingReviewsSchema = z.object({
  id: z.bigint(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  agent_review: z.boolean().nullable(),
  human_review: z.boolean().nullable(),
  notes: z.string().nullable(),
})

export type EmbeddingReviews = z.infer<typeof EmbeddingReviewsSchema>

/////////////////////////////////////////
// ERROR LOGS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="error_logs"
 */
export const ErrorLogsSchema = z.object({
  error_type: ErrorTypeSchema,
  severity: ErrorSeveritySchema,
  id: z.string(),
  service_name: z.string(),
  message: z.string(),
  stack_trace: z.string().nullable(),
  metadata: JsonValueSchema.nullable(),
  context: JsonValueSchema.nullable(),
  user_id: z.string().nullable(),
  request_id: z.string().nullable(),
  correlation_id: z.string().nullable(),
  environment: z.string(),
  created_at: z.coerce.date().nullable(),
  error_hash: z.string().nullable(),
  error_pattern: z.string().nullable(),
  is_new_pattern: z.boolean().nullable(),
  github_repo: z.string().nullable(),
  related_errors: JsonValueSchema.nullable(),
  frequency_data: JsonValueSchema.nullable(),
  domain: z.string().nullable(),
})

export type ErrorLogs = z.infer<typeof ErrorLogsSchema>

/////////////////////////////////////////
// FEATURE REQUESTS SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="feature_requests"
 */
export const FeatureRequestsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  downvotes: z.number().int().nullable(),
  engagement_score: z.number().int().nullable(),
  priority_score: z.number().int().nullable(),
  upvotes: z.number().int().nullable(),
})

export type FeatureRequests = z.infer<typeof FeatureRequestsSchema>

/////////////////////////////////////////
// FEATURE VOTES SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="feature_votes"
 */
export const FeatureVotesSchema = z.object({
  id: z.string(),
  feature_id: z.string(),
  user_id: z.string(),
  vote_type: z.number().int(),
  feedback: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type FeatureVotes = z.infer<typeof FeatureVotesSchema>

/////////////////////////////////////////
// FEED CATEGORIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="feed_categories"
 */
export const FeedCategoriesSchema = z.object({
  id: z.bigint(),
  created_at: z.coerce.date(),
  feed_id: z.string().nullable(),
  category_id: z.bigint().nullable(),
})

export type FeedCategories = z.infer<typeof FeedCategoriesSchema>

/////////////////////////////////////////
// FEED SOURCES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="feed_sources"
 */
export const FeedSourcesSchema = z.object({
  id: z.bigint(),
  feed_id: z.string().nullable(),
  created_at: z.coerce.date(),
  content_source_id: z.bigint().nullable(),
})

export type FeedSources = z.infer<typeof FeedSourcesSchema>

/////////////////////////////////////////
// FEEDBACKS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="feedbacks"
 */
export const FeedbacksSchema = z.object({
  feedback_type: FeedbackTypeSchema.nullable(),
  feedback_status: FeedbackStatusSchema.nullable(),
  id: z.number().int(),
  user_id: z.string().nullable(),
  page_identifier: z.string(),
  rating: z.number().int().nullable(),
  message: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  device_info: z.string().nullable(),
  resolution_comment: z.string().nullable(),
})

export type Feedbacks = z.infer<typeof FeedbacksSchema>

/////////////////////////////////////////
// FEEDS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="feeds"
 */
export const FeedsSchema = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  name: z.string().nullable(),
  user_id: z.string().nullable(),
})

export type Feeds = z.infer<typeof FeedsSchema>

/////////////////////////////////////////
// FOLLOWS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="follows"
 */
export const FollowsSchema = z.object({
  followed_entity: FollowedEntitySchema,
  id: z.string(),
  followed_id: z.string(),
  created_at: z.coerce.date().nullable(),
  user_id: z.string(),
})

export type Follows = z.infer<typeof FollowsSchema>

/////////////////////////////////////////
// JOBS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="jobs"
 */
export const JobsSchema = z.object({
  content_status: ContentStatusSchema,
  id: z.string(),
  contents_id: z.string(),
  title: z.string(),
  company_id: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  published_at: z.coerce.date().nullable(),
  expires_at: z.coerce.date().nullable(),
  scraped_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
  content_source_id: z.bigint().nullable(),
  url: z.string(),
  hash: z.bigint().nullable(),
  employment_type: JsonValueSchema.nullable(),
  metadata: JsonValueSchema.nullable(),
})

export type Jobs = z.infer<typeof JobsSchema>

/////////////////////////////////////////
// METRIC DEFINITIONS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="metric_definitions"
 */
export const MetricDefinitionsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  type: z.string(),
  unit: z.string().nullable(),
  is_dimensional: z.boolean().nullable(),
})

export type MetricDefinitions = z.infer<typeof MetricDefinitionsSchema>

/////////////////////////////////////////
// NEWS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="news"
 */
export const NewsSchema = z.object({
  scrape_frequency: ScrapeFrequencySchema,
  content_status: ContentStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  category_id: z.bigint().nullable(),
  author: z.string().nullable(),
  description: z.string().nullable(),
  featured_image: z.string().nullable(),
  has_summary: z.boolean(),
  published_at: z.coerce.date().nullable(),
  url: z.string(),
  hash: z.bigint().nullable(),
  id: z.string(),
  company_id: z.string().nullable(),
  failed_count: z.number().int().nullable(),
  scraped_at: z.coerce.date().nullable(),
  keywords: JsonValueSchema.nullable(),
  content_source_id: z.bigint().nullable(),
})

export type News = z.infer<typeof NewsSchema>

/////////////////////////////////////////
// NEWS SUMMARIES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="news_summaries"
 */
export const NewsSummariesSchema = z.object({
  complexity_level: ComplexityLevelSchema.nullable(),
  id: z.string(),
  news_id: z.string(),
  summary: z.string().nullable(),
  version: z.number().int(),
  is_current: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type NewsSummaries = z.infer<typeof NewsSummariesSchema>

/////////////////////////////////////////
// NEWS TAGS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="news_tags"
 */
export const NewsTagsSchema = z.object({
  id: z.number().int(),
  tag_id: z.number().int(),
  news_id: z.string().nullable(),
})

export type NewsTags = z.infer<typeof NewsTagsSchema>

/////////////////////////////////////////
// NEWSLETTERS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="newsletters"
 */
export const NewslettersSchema = z.object({
  content_status: ContentStatusSchema,
  id: z.string(),
  title: z.string(),
  frequency: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  generated_content: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Newsletters = z.infer<typeof NewslettersSchema>

/////////////////////////////////////////
// PAYMENT PROVIDERS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="payment_providers"
 */
export const PaymentProvidersSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  is_active: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type PaymentProviders = z.infer<typeof PaymentProvidersSchema>

/////////////////////////////////////////
// PLAN PERMISSIONS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="plan_permissions"
 */
export const PlanPermissionsSchema = z.object({
  plan: AppPlanEnumSchema,
  id: z.number().int(),
  feature: z.string(),
})

export type PlanPermissions = z.infer<typeof PlanPermissionsSchema>

/////////////////////////////////////////
// REFERRALS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="referrals"
 */
export const ReferralsSchema = z.object({
  referral_status: ReferralStatusSchema.nullable(),
  id: z.string(),
  referrer_code: z.string(),
  visitor_id: z.string(),
  created_at: z.coerce.date().nullable(),
  converted_at: z.coerce.date().nullable(),
  conversion_value: z.instanceof(Prisma.Decimal, { message: "Field 'conversion_value' must be a Decimal. Location: ['Models', 'Referrals']"}).nullable(),
  user_agent: z.string().nullable(),
  ip_address: z.string().nullable(),
  landing_page: z.string().nullable(),
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  device_type: z.string().nullable(),
  browser: z.string().nullable(),
  country_code: z.string().nullable(),
  region: z.string().nullable(),
  is_suspicious: z.boolean().nullable(),
  security_flags: JsonValueSchema.nullable(),
  validation_attempts: z.number().int().nullable(),
  last_failed_attempt: z.coerce.date().nullable(),
  client_fingerprint: z.string().nullable(),
})

export type Referrals = z.infer<typeof ReferralsSchema>

/////////////////////////////////////////
// REFERRER BLOCKS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="referrer_blocks"
 */
export const ReferrerBlocksSchema = z.object({
  id: z.string(),
  referrer_code: z.string(),
  blocked_at: z.coerce.date().nullable(),
  blocked_by: z.string(),
  reason: z.string().nullable(),
  is_permanent: z.boolean().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type ReferrerBlocks = z.infer<typeof ReferrerBlocksSchema>

/////////////////////////////////////////
// RESEARCH SCHEMA
/////////////////////////////////////////

/**
 * @client.name="research"
 */
export const ResearchSchema = z.object({
  content_status: ContentStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  published_at: z.coerce.date().nullable(),
  title: z.string().nullable(),
  version: z.number().int().nullable(),
  id: z.string(),
  abstract: z.string().nullable(),
  keywords: z.string().nullable(),
  month: z.string().nullable(),
  year: z.string().nullable(),
  abstract_url: z.string(),
  category: z.string().nullable(),
  doi_url: z.string().nullable(),
  figure_count: z.number().int().nullable(),
  has_embedding: z.boolean().nullable(),
  page_count: z.number().int().nullable(),
  pdf_url: z.string().nullable(),
  published_in: z.string().nullable(),
  table_count: z.number().int().nullable(),
  comments: z.string().nullable(),
  is_flagged: z.boolean(),
  authors: JsonValueSchema.nullable(),
  summary: z.string().nullable(),
  affiliations: JsonValueSchema.nullable(),
})

export type Research = z.infer<typeof ResearchSchema>

/////////////////////////////////////////
// RESEARCH EMBEDDINGS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="research_embeddings"
 */
export const ResearchEmbeddingsSchema = z.object({
  id: z.number().int(),
  research_id: z.string(),
  chunk: z.string(),
  url: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  is_flagged: z.boolean().nullable(),
  updated_at: z.coerce.date(),
  embedding_review_id: z.bigint().nullable(),
})

export type ResearchEmbeddings = z.infer<typeof ResearchEmbeddingsSchema>

/////////////////////////////////////////
// RESPONSES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="responses"
 */
export const ResponsesSchema = z.object({
  id: z.bigint(),
  search_id: z.bigint(),
  output: z.string(),
  upvotes: z.number().int().nullable(),
  downvotes: z.number().int().nullable(),
  created_at: z.coerce.date().nullable(),
})

export type Responses = z.infer<typeof ResponsesSchema>

/////////////////////////////////////////
// ROLE HIERARCHY SCHEMA
/////////////////////////////////////////

/**
 * @client.name="role_hierarchy"
 */
export const RoleHierarchySchema = z.object({
  parent_role: AppRoleEnumSchema,
  child_role: AppRoleEnumSchema,
})

export type RoleHierarchy = z.infer<typeof RoleHierarchySchema>

/////////////////////////////////////////
// ROLE PERMISSIONS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="role_permissions"
 */
export const RolePermissionsSchema = z.object({
  role: AppRoleEnumSchema,
  inherit_from: AppRoleEnumSchema.array(),
  id: z.number().int(),
  table_name: z.string(),
  conditions: JsonValueSchema.nullable(),
  permissions: JsonValueSchema.nullable(),
  cached_permissions: JsonValueSchema.nullable(),
  last_updated: z.coerce.date().nullable(),
})

export type RolePermissions = z.infer<typeof RolePermissionsSchema>

/////////////////////////////////////////
// ROLE PERMISSIONS MATERIALIZED SCHEMA
/////////////////////////////////////////

/**
 * @client.name="role_permissions_materialized"
 */
export const RolePermissionsMaterializedSchema = z.object({
  role: AppRoleEnumSchema,
  permissions: JsonValueSchema,
  last_updated: z.coerce.date().nullable(),
})

export type RolePermissionsMaterialized = z.infer<typeof RolePermissionsMaterializedSchema>

/////////////////////////////////////////
// SCORING WEIGHTS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="scoring_weights"
 */
export const ScoringWeightsSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
  description: z.string().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type ScoringWeights = z.infer<typeof ScoringWeightsSchema>

/////////////////////////////////////////
// SEARCHES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="searches"
 */
export const SearchesSchema = z.object({
  id: z.bigint(),
  input: z.string(),
  created_at: z.coerce.date().nullable(),
  tokens_used: z.number().int().nullable(),
  user_ids: z.string().array(),
})

export type Searches = z.infer<typeof SearchesSchema>

/////////////////////////////////////////
// SOCIAL MEDIA SCHEMA
/////////////////////////////////////////

/**
 * @client.name="social_media"
 */
export const SocialMediaSchema = z.object({
  id: z.number().int(),
  facebook_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  instagram_url: z.string().nullable(),
  youtube_url: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type SocialMedia = z.infer<typeof SocialMediaSchema>

/////////////////////////////////////////
// SPIDER METRICS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="spider_metrics"
 */
export const SpiderMetricsSchema = z.object({
  id: z.bigint(),
  crawl_id: z.string(),
  metric_id: z.number().int().nullable(),
  timestamp: z.coerce.date(),
  value: JsonValueSchema,
})

export type SpiderMetrics = z.infer<typeof SpiderMetricsSchema>

/////////////////////////////////////////
// STRAPI MIGRATIONS SCHEMA
/////////////////////////////////////////

/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 * @client.name="strapi_migrations"
 */
export const StrapiMigrationsSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  time: z.coerce.date().nullable(),
})

export type StrapiMigrations = z.infer<typeof StrapiMigrationsSchema>

/////////////////////////////////////////
// STRAPI MIGRATIONS INTERNAL SCHEMA
/////////////////////////////////////////

/**
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 * @client.name="strapi_migrations_internal"
 */
export const StrapiMigrationsInternalSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  time: z.coerce.date().nullable(),
})

export type StrapiMigrationsInternal = z.infer<typeof StrapiMigrationsInternalSchema>

/////////////////////////////////////////
// TABLE MAINTENANCE LOG SCHEMA
/////////////////////////////////////////

/**
 * @client.name="table_maintenance_log"
 */
export const TableMaintenanceLogSchema = z.object({
  id: z.number().int(),
  operation: z.string().nullable(),
  detail: z.string().nullable(),
  logged_at: z.coerce.date().nullable(),
})

export type TableMaintenanceLog = z.infer<typeof TableMaintenanceLogSchema>

/////////////////////////////////////////
// TABLE STATISTICS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="table_statistics"
 */
export const TableStatisticsSchema = z.object({
  table_name: z.string(),
  row_count: z.bigint().nullable(),
  table_size: z.bigint().nullable(),
  index_size: z.bigint().nullable(),
  live_tuples: z.bigint().nullable(),
  dead_tuples: z.bigint().nullable(),
  last_vacuum: z.coerce.date().nullable(),
  last_analyze: z.coerce.date().nullable(),
  estimated_bloat_ratio: z.number().nullable(),
  buffer_cache_hit_ratio: z.number().nullable(),
  index_usage: JsonValueSchema.nullable(),
  seq_scan_count: z.bigint().nullable(),
  index_scan_count: z.bigint().nullable(),
  capture_time: z.coerce.date(),
})

export type TableStatistics = z.infer<typeof TableStatisticsSchema>

/////////////////////////////////////////
// TAGS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="tags"
 */
export const TagsSchema = z.object({
  id: z.number().int(),
  body: z.string().nullable(),
  name: z.string(),
  document_id: z.string().nullable(),
  locale: z.string().nullable(),
  published_at: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Tags = z.infer<typeof TagsSchema>

/////////////////////////////////////////
// USER METRICS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="user_metrics"
 */
export const UserMetricsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  total_votes: z.number().int().nullable(),
  upvote_count: z.number().int().nullable(),
  downvote_count: z.number().int().nullable(),
  vote_accuracy: z.instanceof(Prisma.Decimal, { message: "Field 'vote_accuracy' must be a Decimal. Location: ['Models', 'UserMetrics']"}).nullable(),
  current_streak: z.number().int().nullable(),
  best_streak: z.number().int().nullable(),
  today_vote_count: z.number().int().nullable(),
  total_reading_time: z.number().int().nullable(),
  last_vote_date: z.coerce.date().nullable(),
  points: z.number().int().nullable(),
  points_breakdown: JsonValueSchema.nullable(),
  interaction_stats: JsonValueSchema.nullable(),
  achievements: JsonValueSchema.nullable(),
  titles: JsonValueSchema.nullable(),
  multipliers: JsonValueSchema.nullable(),
  current_level: z.number().int().nullable(),
  current_xp: z.number().int().nullable(),
  xp_to_next_level: z.number().int().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type UserMetrics = z.infer<typeof UserMetricsSchema>

/////////////////////////////////////////
// USER PROFILES SCHEMA
/////////////////////////////////////////

/**
 * @client.name="user_profiles"
 */
export const UserProfilesSchema = z.object({
  plan: AppPlanEnumSchema.nullable(),
  role: AppRoleEnumSchema,
  id: z.string(),
  email: z.string(),
  given_name: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  dob: z.coerce.date().nullable(),
  gender_id: z.number().int().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  last_seen: z.coerce.date().nullable(),
  avatar: z.string().nullable(),
  introduction: z.string().nullable(),
  followed_count: z.number().int().nullable(),
  followers_count: z.number().int().nullable(),
  is_active: z.boolean().nullable(),
})

export type UserProfiles = z.infer<typeof UserProfilesSchema>

/////////////////////////////////////////
// VOTES SCHEMA
/////////////////////////////////////////

/**
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 * @client.name="votes"
 */
export const VotesSchema = z.object({
  id: z.string(),
  content_type: z.string(),
  content_id: z.string(),
  user_id: z.string(),
  vote_type: z.number().int(),
  created_at: z.coerce.date().nullable(),
})

export type Votes = z.infer<typeof VotesSchema>

/////////////////////////////////////////
// WORKFLOWS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="workflows"
 */
export const WorkflowsSchema = z.object({
  status: JobStatusSchema,
  id: z.string(),
  name: z.string(),
  metadata: JsonValueSchema.nullable(),
  started_at: z.coerce.date().nullable(),
  completed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
})

export type Workflows = z.infer<typeof WorkflowsSchema>

/////////////////////////////////////////
// USERS SCHEMA
/////////////////////////////////////////

/**
 * @client.name="users"
 */
export const UsersSchema = z.object({
  id: z.string(),
})

export type Users = z.infer<typeof UsersSchema>

/////////////////////////////////////////
// SECURITY METRICS SCHEMA
/////////////////////////////////////////

export const security_metricsSchema = z.object({
  time_bucket: z.coerce.date(),
  total_attempts: z.bigint().nullable(),
  suspicious_attempts: z.bigint().nullable(),
  unique_ips: z.bigint().nullable(),
  unique_referrers: z.bigint().nullable(),
  high_attempt_count: z.bigint().nullable(),
  max_attempts: z.number().int().nullable(),
})

export type security_metrics = z.infer<typeof security_metricsSchema>

/////////////////////////////////////////
// ERROR FREQUENCY SCHEMA
/////////////////////////////////////////

export const error_frequencySchema = z.object({
  error_type: ErrorTypeSchema,
  severity: ErrorSeveritySchema,
  service_name: z.string(),
  time_bucket: z.coerce.date(),
  error_count: z.bigint().nullable(),
})

export type error_frequency = z.infer<typeof error_frequencySchema>

/////////////////////////////////////////
// ERROR STATS SCHEMA
/////////////////////////////////////////

export const error_statsSchema = z.object({
  calls: z.bigint().nullable(),
  mean_exec_time: z.number().nullable(),
  max_exec_time: z.number().nullable(),
  rows: z.bigint().nullable(),
  query: z.string(),
  queryid: z.bigint(),
  toplevel: z.boolean().nullable(),
})

export type error_stats = z.infer<typeof error_statsSchema>

/////////////////////////////////////////
// RECENT ERRORS SCHEMA
/////////////////////////////////////////

export const recent_errorsSchema = z.object({
  error_type: ErrorTypeSchema,
  severity: ErrorSeveritySchema,
  id: z.string(),
  created_at: z.coerce.date(),
  service_name: z.string(),
  message: z.string(),
  metadata: JsonValueSchema.nullable(),
})

export type recent_errors = z.infer<typeof recent_errorsSchema>

/////////////////////////////////////////
// SLOW QUERY PATTERNS SCHEMA
/////////////////////////////////////////

export const slow_query_patternsSchema = z.object({
  query_id: z.string(),
  occurrence_count: z.bigint().nullable(),
  avg_exec_time: z.number().nullable(),
  max_exec_time: z.number().nullable(),
  first_seen: z.coerce.date(),
  last_seen: z.coerce.date(),
})

export type slow_query_patterns = z.infer<typeof slow_query_patternsSchema>

/////////////////////////////////////////
// ERROR METRICS SCHEMA
/////////////////////////////////////////

export const error_metricsSchema = z.object({
  error_type: ErrorTypeSchema,
  severity: ErrorSeveritySchema,
  time_bucket: z.coerce.date(),
  service_name: z.string(),
  error_count: z.bigint().nullable(),
})

export type error_metrics = z.infer<typeof error_metricsSchema>
