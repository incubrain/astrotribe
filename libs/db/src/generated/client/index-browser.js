
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.2.1
 * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
 */
Prisma.prismaVersion = {
  client: "6.2.1",
  engine: "4123509d24aa4dede1e864b46351bf2790323b69"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AdDailyMetricsScalarFieldEnum = {
  id: 'id',
  variant_id: 'variant_id',
  date: 'date',
  views: 'views',
  clicks: 'clicks',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AdPackagesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  position: 'position',
  active: 'active',
  created_at: 'created_at',
  updated_at: 'updated_at',
  description: 'description',
  price: 'price',
  features: 'features',
  expected_ctr: 'expected_ctr',
  avg_roi: 'avg_roi',
  view_frequency: 'view_frequency'
};

exports.Prisma.AdVariantsScalarFieldEnum = {
  id: 'id',
  ad_id: 'ad_id',
  content: 'content',
  is_control: 'is_control',
  active: 'active',
  created_at: 'created_at',
  updated_at: 'updated_at',
  performance_metrics: 'performance_metrics'
};

exports.Prisma.AddressesScalarFieldEnum = {
  id: 'id',
  street1: 'street1',
  street2: 'street2',
  city_id: 'city_id',
  country_id: 'country_id',
  name: 'name',
  user_id: 'user_id',
  is_primary: 'is_primary',
  address_type: 'address_type',
  created_at: 'created_at',
  updated_at: 'updated_at',
  company_id: 'company_id'
};

exports.Prisma.AdsScalarFieldEnum = {
  id: 'id',
  company_id: 'company_id',
  package_id: 'package_id',
  start_date: 'start_date',
  end_date: 'end_date',
  active: 'active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AgentMetricsScalarFieldEnum = {
  id: 'id',
  agent_name: 'agent_name',
  execution_date: 'execution_date',
  status: 'status',
  duration_ms: 'duration_ms',
  items_processed: 'items_processed',
  error_type: 'error_type',
  error_message: 'error_message',
  created_at: 'created_at'
};

exports.Prisma.BlacklistedDomainsScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  url: 'url',
  reason: 'reason'
};

exports.Prisma.BlacklistedUrlsScalarFieldEnum = {
  id: 'id',
  url: 'url',
  reason: 'reason',
  created_at: 'created_at',
  company_id: 'company_id'
};

exports.Prisma.BlockedIpsScalarFieldEnum = {
  id: 'id',
  ip_address: 'ip_address',
  blocked_at: 'blocked_at',
  blocked_until: 'blocked_until',
  failed_attempts: 'failed_attempts',
  reason: 'reason',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.BookmarkFoldersScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  color: 'color',
  parent_id: 'parent_id',
  is_default: 'is_default',
  is_favorite: 'is_favorite',
  position: 'position',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.BookmarksScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  content_id: 'content_id',
  content_type: 'content_type',
  created_at: 'created_at',
  folder_id: 'folder_id',
  metadata: 'metadata',
  updated_at: 'updated_at'
};

exports.Prisma.CategoriesScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  body: 'body',
  name: 'name',
  document_id: 'document_id',
  locale: 'locale',
  published_at: 'published_at'
};

exports.Prisma.CircuitBreakerStatesScalarFieldEnum = {
  id: 'id',
  job_name: 'job_name',
  state: 'state',
  failure_count: 'failure_count',
  last_failure: 'last_failure',
  last_success: 'last_success',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CitiesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  country_id: 'country_id',
  state: 'state'
};

exports.Prisma.ClassifiedUrlsScalarFieldEnum = {
  id: 'id',
  url: 'url',
  predicted_category: 'predicted_category',
  actual_category: 'actual_category',
  is_reviewed: 'is_reviewed',
  added_to_training: 'added_to_training',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CommentsScalarFieldEnum = {
  id: 'id',
  content: 'content',
  user_id: 'user_id',
  content_id: 'content_id',
  content_type: 'content_type',
  parent_comment_id: 'parent_comment_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CompaniesScalarFieldEnum = {
  name: 'name',
  description: 'description',
  logo_url: 'logo_url',
  url: 'url',
  social_media_id: 'social_media_id',
  scrape_frequency: 'scrape_frequency',
  category_id: 'category_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  founding_year: 'founding_year',
  is_government: 'is_government',
  category: 'category',
  failed_count: 'failed_count',
  is_english: 'is_english',
  scrape_rating: 'scrape_rating',
  id: 'id',
  scraped_at: 'scraped_at',
  content_status: 'content_status',
  keywords: 'keywords'
};

exports.Prisma.CompanyContactsScalarFieldEnum = {
  id: 'id',
  contact_id: 'contact_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  company_id: 'company_id'
};

exports.Prisma.CompanyEmployeesScalarFieldEnum = {
  role: 'role',
  job_description: 'job_description',
  start_date: 'start_date',
  end_date: 'end_date',
  status: 'status',
  access_level: 'access_level',
  created_at: 'created_at',
  updated_at: 'updated_at',
  company_id: 'company_id',
  user_id: 'user_id',
  id: 'id'
};

exports.Prisma.CompanyExtrasScalarFieldEnum = {
  id: 'id',
  updated_at: 'updated_at',
  created_at: 'created_at',
  url: 'url',
  success: 'success',
  category: 'category',
  level: 'level',
  company_id: 'company_id',
  body: 'body',
  found_count: 'found_count',
  review: 'review'
};

exports.Prisma.CompanyMetricsScalarFieldEnum = {
  id: 'id',
  crawl_id: 'crawl_id',
  company_id: 'company_id',
  metric_id: 'metric_id',
  timestamp: 'timestamp',
  value: 'value'
};

exports.Prisma.CompanyUrlsScalarFieldEnum = {
  id: 'id',
  updated_at: 'updated_at',
  created_at: 'created_at',
  url: 'url',
  success: 'success',
  category: 'category',
  company_id: 'company_id',
  content: 'content',
  distance: 'distance'
};

exports.Prisma.ContactsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  is_primary: 'is_primary',
  email: 'email',
  contact_type: 'contact_type',
  privacy_level: 'privacy_level',
  user_id: 'user_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  phone: 'phone',
  company_id: 'company_id'
};

exports.Prisma.ContentCategoriesScalarFieldEnum = {
  content_id: 'content_id',
  category_id: 'category_id',
  is_primary: 'is_primary'
};

exports.Prisma.ContentSourceVisitsScalarFieldEnum = {
  id: 'id',
  content_id: 'content_id',
  user_id: 'user_id',
  created_at: 'created_at'
};

exports.Prisma.ContentSourcesScalarFieldEnum = {
  id: 'id',
  url: 'url',
  content_type: 'content_type',
  scrape_frequency: 'scrape_frequency',
  created_at: 'created_at',
  updated_at: 'updated_at',
  refreshed_at: 'refreshed_at',
  has_failed: 'has_failed',
  failed_count: 'failed_count',
  priority: 'priority',
  hash: 'hash',
  scraped_at: 'scraped_at',
  expected_count: 'expected_count',
  company_id: 'company_id',
  rss_urls: 'rss_urls'
};

exports.Prisma.ContentStatusesScalarFieldEnum = {
  id: 'id',
  content_id: 'content_id',
  notes: 'notes',
  created_at: 'created_at',
  content_status: 'content_status'
};

exports.Prisma.ContentTagsScalarFieldEnum = {
  content_id: 'content_id',
  tag_id: 'tag_id'
};

exports.Prisma.ContentsScalarFieldEnum = {
  id: 'id',
  content_type: 'content_type',
  title: 'title',
  created_at: 'created_at',
  updated_at: 'updated_at',
  url: 'url',
  rss_url: 'rss_url',
  hot_score: 'hot_score'
};

exports.Prisma.CountriesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  code_3: 'code_3'
};

exports.Prisma.CustomerPaymentsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  subscription_id: 'subscription_id',
  payment_provider_id: 'payment_provider_id',
  external_payment_id: 'external_payment_id',
  external_order_id: 'external_order_id',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  method: 'method',
  description: 'description',
  fee: 'fee',
  tax: 'tax',
  error_code: 'error_code',
  error_description: 'error_description',
  acquirer_data: 'acquirer_data',
  notes: 'notes',
  created_at: 'created_at',
  order_id: 'order_id',
  invoice_id: 'invoice_id',
  international: 'international',
  amount_refunded: 'amount_refunded',
  amount_transferred: 'amount_transferred',
  refund_status: 'refund_status',
  captured: 'captured',
  bank: 'bank',
  wallet: 'wallet',
  vpa: 'vpa',
  error_source: 'error_source',
  error_step: 'error_step',
  error_reason: 'error_reason'
};

exports.Prisma.CustomerProcessedWebhooksScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  event_type: 'event_type',
  processed_at: 'processed_at'
};

exports.Prisma.CustomerRefundsScalarFieldEnum = {
  id: 'id',
  payment_id: 'payment_id',
  external_refund_id: 'external_refund_id',
  amount: 'amount',
  status: 'status',
  speed_processed: 'speed_processed',
  speed_requested: 'speed_requested',
  notes: 'notes',
  created_at: 'created_at',
  currency: 'currency',
  receipt: 'receipt',
  acquirer_data: 'acquirer_data',
  batch_id: 'batch_id'
};

exports.Prisma.CustomerSubscriptionPlansScalarFieldEnum = {
  id: 'id',
  external_plan_id: 'external_plan_id',
  name: 'name',
  description: 'description',
  interval: 'interval',
  interval_type: 'interval_type',
  monthly_amount: 'monthly_amount',
  annual_amount: 'annual_amount',
  currency: 'currency',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
  features: 'features'
};

exports.Prisma.CustomerSubscriptionsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  plan_id: 'plan_id',
  payment_provider_id: 'payment_provider_id',
  external_subscription_id: 'external_subscription_id',
  status: 'status',
  quantity: 'quantity',
  current_start: 'current_start',
  current_end: 'current_end',
  ended_at: 'ended_at',
  cancel_at_period_end: 'cancel_at_period_end',
  total_count: 'total_count',
  paid_count: 'paid_count',
  remaining_count: 'remaining_count',
  auth_attempts: 'auth_attempts',
  created_at: 'created_at',
  updated_at: 'updated_at',
  type: 'type',
  charge_at: 'charge_at',
  start_at: 'start_at',
  end_at: 'end_at',
  customer_notify: 'customer_notify',
  expire_by: 'expire_by',
  short_url: 'short_url',
  has_scheduled_changes: 'has_scheduled_changes',
  change_scheduled_at: 'change_scheduled_at',
  source: 'source',
  offer_id: 'offer_id',
  pause_initiated_by: 'pause_initiated_by',
  cancel_initiated_by: 'cancel_initiated_by',
  notes: 'notes'
};

exports.Prisma.EmbeddingReviewsScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  agent_review: 'agent_review',
  human_review: 'human_review',
  notes: 'notes'
};

exports.Prisma.ErrorLogsScalarFieldEnum = {
  id: 'id',
  service_name: 'service_name',
  error_type: 'error_type',
  severity: 'severity',
  message: 'message',
  stack_trace: 'stack_trace',
  metadata: 'metadata',
  context: 'context',
  user_id: 'user_id',
  request_id: 'request_id',
  correlation_id: 'correlation_id',
  environment: 'environment',
  created_at: 'created_at',
  error_hash: 'error_hash',
  error_pattern: 'error_pattern',
  is_new_pattern: 'is_new_pattern',
  github_repo: 'github_repo',
  related_errors: 'related_errors',
  frequency_data: 'frequency_data',
  domain: 'domain'
};

exports.Prisma.FeatureRequestsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at',
  downvotes: 'downvotes',
  engagement_score: 'engagement_score',
  priority_score: 'priority_score',
  upvotes: 'upvotes'
};

exports.Prisma.FeatureVotesScalarFieldEnum = {
  id: 'id',
  feature_id: 'feature_id',
  user_id: 'user_id',
  vote_type: 'vote_type',
  feedback: 'feedback',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.FeedCategoriesScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  feed_id: 'feed_id',
  category_id: 'category_id'
};

exports.Prisma.FeedSourcesScalarFieldEnum = {
  id: 'id',
  feed_id: 'feed_id',
  created_at: 'created_at',
  content_source_id: 'content_source_id'
};

exports.Prisma.FeedbacksScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  page_identifier: 'page_identifier',
  rating: 'rating',
  feedback_type: 'feedback_type',
  message: 'message',
  created_at: 'created_at',
  updated_at: 'updated_at',
  device_info: 'device_info',
  resolution_comment: 'resolution_comment',
  feedback_status: 'feedback_status'
};

exports.Prisma.FeedsScalarFieldEnum = {
  id: 'id',
  created_at: 'created_at',
  name: 'name',
  user_id: 'user_id'
};

exports.Prisma.FollowsScalarFieldEnum = {
  id: 'id',
  followed_id: 'followed_id',
  followed_entity: 'followed_entity',
  created_at: 'created_at',
  user_id: 'user_id'
};

exports.Prisma.JobConfigsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  schedule: 'schedule',
  priority: 'priority',
  timeout_ms: 'timeout_ms',
  retry_limit: 'retry_limit',
  circuit_breaker_enabled: 'circuit_breaker_enabled',
  circuit_breaker_threshold: 'circuit_breaker_threshold',
  circuit_breaker_timeout_ms: 'circuit_breaker_timeout_ms',
  enabled: 'enabled',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.JobLocksScalarFieldEnum = {
  id: 'id',
  job_name: 'job_name',
  lock_key: 'lock_key',
  lock_value: 'lock_value',
  acquired_at: 'acquired_at',
  expires_at: 'expires_at',
  created_at: 'created_at'
};

exports.Prisma.JobMetricsScalarFieldEnum = {
  id: 'id',
  job_name: 'job_name',
  job_id: 'job_id',
  status: 'status',
  started_at: 'started_at',
  completed_at: 'completed_at',
  failed_at: 'failed_at',
  duration_ms: 'duration_ms',
  items_processed: 'items_processed',
  error_message: 'error_message',
  error_stack: 'error_stack',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.JobQueueStatsScalarFieldEnum = {
  id: 'id',
  queue_name: 'queue_name',
  created_count: 'created_count',
  retry_count: 'retry_count',
  active_count: 'active_count',
  completed_count: 'completed_count',
  cancelled_count: 'cancelled_count',
  failed_count: 'failed_count',
  total_count: 'total_count',
  updated_at: 'updated_at',
  created_at: 'created_at'
};

exports.Prisma.JobVersionsScalarFieldEnum = {
  id: 'id',
  job_name: 'job_name',
  version: 'version',
  changes: 'changes',
  config: 'config',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MetricDefinitionsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  type: 'type',
  unit: 'unit',
  is_dimensional: 'is_dimensional'
};

exports.Prisma.NewsScalarFieldEnum = {
  created_at: 'created_at',
  updated_at: 'updated_at',
  title: 'title',
  body: 'body',
  category_id: 'category_id',
  author: 'author',
  description: 'description',
  featured_image: 'featured_image',
  has_summary: 'has_summary',
  published_at: 'published_at',
  url: 'url',
  hash: 'hash',
  id: 'id',
  company_id: 'company_id',
  failed_count: 'failed_count',
  scrape_frequency: 'scrape_frequency',
  scraped_at: 'scraped_at',
  content_status: 'content_status',
  keywords: 'keywords',
  content_source_id: 'content_source_id'
};

exports.Prisma.NewsSummariesScalarFieldEnum = {
  id: 'id',
  news_id: 'news_id',
  summary: 'summary',
  version: 'version',
  is_current: 'is_current',
  created_at: 'created_at',
  updated_at: 'updated_at',
  complexity_level: 'complexity_level'
};

exports.Prisma.NewsTagsScalarFieldEnum = {
  id: 'id',
  tag_id: 'tag_id',
  news_id: 'news_id'
};

exports.Prisma.NewslettersScalarFieldEnum = {
  id: 'id',
  title: 'title',
  frequency: 'frequency',
  start_date: 'start_date',
  end_date: 'end_date',
  generated_content: 'generated_content',
  created_at: 'created_at',
  updated_at: 'updated_at',
  content_status: 'content_status'
};

exports.Prisma.PaymentProvidersScalarFieldEnum = {
  id: 'id',
  name: 'name',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.PlanPermissionsScalarFieldEnum = {
  id: 'id',
  plan: 'plan',
  feature: 'feature'
};

exports.Prisma.ReferralsScalarFieldEnum = {
  id: 'id',
  referrer_code: 'referrer_code',
  visitor_id: 'visitor_id',
  created_at: 'created_at',
  converted_at: 'converted_at',
  referral_status: 'referral_status',
  conversion_value: 'conversion_value',
  user_agent: 'user_agent',
  ip_address: 'ip_address',
  landing_page: 'landing_page',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  device_type: 'device_type',
  browser: 'browser',
  country_code: 'country_code',
  region: 'region',
  is_suspicious: 'is_suspicious',
  security_flags: 'security_flags',
  validation_attempts: 'validation_attempts',
  last_failed_attempt: 'last_failed_attempt',
  client_fingerprint: 'client_fingerprint'
};

exports.Prisma.ReferrerBlocksScalarFieldEnum = {
  id: 'id',
  referrer_code: 'referrer_code',
  blocked_at: 'blocked_at',
  blocked_by: 'blocked_by',
  reason: 'reason',
  is_permanent: 'is_permanent',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ResearchScalarFieldEnum = {
  created_at: 'created_at',
  updated_at: 'updated_at',
  published_at: 'published_at',
  title: 'title',
  version: 'version',
  id: 'id',
  abstract: 'abstract',
  keywords: 'keywords',
  month: 'month',
  year: 'year',
  abstract_url: 'abstract_url',
  category: 'category',
  doi_url: 'doi_url',
  figure_count: 'figure_count',
  has_embedding: 'has_embedding',
  page_count: 'page_count',
  pdf_url: 'pdf_url',
  published_in: 'published_in',
  table_count: 'table_count',
  comments: 'comments',
  is_flagged: 'is_flagged',
  authors: 'authors',
  summary: 'summary',
  content_status: 'content_status',
  affiliations: 'affiliations'
};

exports.Prisma.ResearchEmbeddingsScalarFieldEnum = {
  id: 'id',
  research_id: 'research_id',
  chunk: 'chunk',
  url: 'url',
  created_at: 'created_at',
  is_flagged: 'is_flagged',
  updated_at: 'updated_at',
  embedding_review_id: 'embedding_review_id'
};

exports.Prisma.ResponsesScalarFieldEnum = {
  id: 'id',
  search_id: 'search_id',
  output: 'output',
  upvotes: 'upvotes',
  downvotes: 'downvotes',
  created_at: 'created_at'
};

exports.Prisma.RoleHierarchyScalarFieldEnum = {
  parent_role: 'parent_role',
  child_role: 'child_role'
};

exports.Prisma.RolePermissionsScalarFieldEnum = {
  id: 'id',
  role: 'role',
  table_name: 'table_name',
  conditions: 'conditions',
  permissions: 'permissions',
  cached_permissions: 'cached_permissions',
  inherit_from: 'inherit_from',
  last_updated: 'last_updated'
};

exports.Prisma.RolePermissionsMaterializedScalarFieldEnum = {
  role: 'role',
  permissions: 'permissions',
  last_updated: 'last_updated'
};

exports.Prisma.ScoringWeightsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  weight: 'weight',
  description: 'description',
  updated_at: 'updated_at'
};

exports.Prisma.SearchesScalarFieldEnum = {
  id: 'id',
  input: 'input',
  created_at: 'created_at',
  tokens_used: 'tokens_used',
  user_ids: 'user_ids'
};

exports.Prisma.SocialMediaScalarFieldEnum = {
  id: 'id',
  facebook_url: 'facebook_url',
  twitter_url: 'twitter_url',
  linkedin_url: 'linkedin_url',
  instagram_url: 'instagram_url',
  youtube_url: 'youtube_url',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SpiderMetricsScalarFieldEnum = {
  id: 'id',
  crawl_id: 'crawl_id',
  metric_id: 'metric_id',
  timestamp: 'timestamp',
  value: 'value'
};

exports.Prisma.StrapiMigrationsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  time: 'time'
};

exports.Prisma.StrapiMigrationsInternalScalarFieldEnum = {
  id: 'id',
  name: 'name',
  time: 'time'
};

exports.Prisma.TableMaintenanceLogScalarFieldEnum = {
  id: 'id',
  operation: 'operation',
  detail: 'detail',
  logged_at: 'logged_at'
};

exports.Prisma.TableStatisticsScalarFieldEnum = {
  table_name: 'table_name',
  row_count: 'row_count',
  table_size: 'table_size',
  index_size: 'index_size',
  live_tuples: 'live_tuples',
  dead_tuples: 'dead_tuples',
  last_vacuum: 'last_vacuum',
  last_analyze: 'last_analyze',
  estimated_bloat_ratio: 'estimated_bloat_ratio',
  buffer_cache_hit_ratio: 'buffer_cache_hit_ratio',
  index_usage: 'index_usage',
  seq_scan_count: 'seq_scan_count',
  index_scan_count: 'index_scan_count',
  capture_time: 'capture_time'
};

exports.Prisma.TagsScalarFieldEnum = {
  id: 'id',
  body: 'body',
  name: 'name',
  document_id: 'document_id',
  locale: 'locale',
  published_at: 'published_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserMetricsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  total_votes: 'total_votes',
  upvote_count: 'upvote_count',
  downvote_count: 'downvote_count',
  vote_accuracy: 'vote_accuracy',
  current_streak: 'current_streak',
  best_streak: 'best_streak',
  today_vote_count: 'today_vote_count',
  total_reading_time: 'total_reading_time',
  last_vote_date: 'last_vote_date',
  points: 'points',
  points_breakdown: 'points_breakdown',
  interaction_stats: 'interaction_stats',
  achievements: 'achievements',
  titles: 'titles',
  multipliers: 'multipliers',
  current_level: 'current_level',
  current_xp: 'current_xp',
  xp_to_next_level: 'xp_to_next_level',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserProfilesScalarFieldEnum = {
  id: 'id',
  email: 'email',
  given_name: 'given_name',
  surname: 'surname',
  username: 'username',
  dob: 'dob',
  gender_id: 'gender_id',
  created_at: 'created_at',
  updated_at: 'updated_at',
  last_seen: 'last_seen',
  avatar: 'avatar',
  introduction: 'introduction',
  followed_count: 'followed_count',
  followers_count: 'followers_count',
  plan: 'plan',
  role: 'role',
  is_active: 'is_active'
};

exports.Prisma.VotesScalarFieldEnum = {
  id: 'id',
  content_type: 'content_type',
  content_id: 'content_id',
  user_id: 'user_id',
  vote_type: 'vote_type',
  created_at: 'created_at'
};

exports.Prisma.WorkflowJobsScalarFieldEnum = {
  id: 'id',
  workflow_id: 'workflow_id',
  job_id: 'job_id',
  job_name: 'job_name',
  status: 'status',
  sequence_number: 'sequence_number',
  depends_on: 'depends_on',
  started_at: 'started_at',
  completed_at: 'completed_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.WorkflowsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  status: 'status',
  metadata: 'metadata',
  started_at: 'started_at',
  completed_at: 'completed_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UsersScalarFieldEnum = {
  id: 'id'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AddressType = exports.$Enums.AddressType = {
  residential: 'residential',
  headquarters: 'headquarters',
  office: 'office',
  factory: 'factory',
  lab: 'lab',
  warehouse: 'warehouse',
  research: 'research',
  retail: 'retail',
  showroom: 'showroom',
  branch: 'branch'
};

exports.ContentType = exports.$Enums.ContentType = {
  news: 'news',
  events: 'events',
  jobs: 'jobs',
  research: 'research',
  companies: 'companies',
  contact: 'contact',
  people: 'people',
  newsletters: 'newsletters',
  unknown: 'unknown'
};

exports.ScrapeFrequency = exports.$Enums.ScrapeFrequency = {
  four_times_daily: 'four_times_daily',
  twice_daily: 'twice_daily',
  daily: 'daily',
  twice_weekly: 'twice_weekly',
  weekly: 'weekly',
  bi_weekly: 'bi_weekly',
  monthly: 'monthly',
  quarterly: 'quarterly',
  biannual: 'biannual',
  annually: 'annually',
  never: 'never'
};

exports.ContentStatus = exports.$Enums.ContentStatus = {
  draft: 'draft',
  pending_agent_action: 'pending_agent_action',
  pending_agent_review: 'pending_agent_review',
  pending_human_review: 'pending_human_review',
  pending_relevance_check: 'pending_relevance_check',
  irrelevant: 'irrelevant',
  scheduled: 'scheduled',
  unpublished: 'unpublished',
  archived: 'archived',
  published: 'published',
  failed: 'failed',
  pending_crawl: 'pending_crawl',
  scraped: 'scraped',
  outdated: 'outdated',
  updated: 'updated',
  new: 'new'
};

exports.AccessLevel = exports.$Enums.AccessLevel = {
  viewer: 'viewer',
  editor: 'editor',
  admin: 'admin',
  super_admin: 'super_admin'
};

exports.ContactType = exports.$Enums.ContactType = {
  personal: 'personal',
  company: 'company',
  professional: 'professional',
  recruitment: 'recruitment',
  founder: 'founder'
};

exports.PrivacyLevel = exports.$Enums.PrivacyLevel = {
  private: 'private',
  connected: 'connected',
  public: 'public'
};

exports.Priority = exports.$Enums.Priority = {
  very_low: 'very_low',
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical'
};

exports.ErrorType = exports.$Enums.ErrorType = {
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SLOW_QUERY: 'SLOW_QUERY',
  ERROR_SPIKE: 'ERROR_SPIKE',
  AUTH_ERROR: 'AUTH_ERROR',
  TABLE_ERROR: 'TABLE_ERROR',
  TABLE_OPERATION: 'TABLE_OPERATION'
};

exports.ErrorSeverity = exports.$Enums.ErrorSeverity = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical'
};

exports.FeedbackType = exports.$Enums.FeedbackType = {
  bug_report: 'bug_report',
  feature_request: 'feature_request',
  user_interface_issue: 'user_interface_issue',
  performance_issue: 'performance_issue',
  documentation: 'documentation'
};

exports.FeedbackStatus = exports.$Enums.FeedbackStatus = {
  new: 'new',
  under_review: 'under_review',
  backlog: 'backlog',
  working_on: 'working_on',
  resolved: 'resolved',
  rejected: 'rejected',
  deferred: 'deferred'
};

exports.FollowedEntity = exports.$Enums.FollowedEntity = {
  company: 'company',
  user: 'user'
};

exports.JobPriority = exports.$Enums.JobPriority = {
  critical: 'critical',
  high: 'high',
  normal: 'normal',
  low: 'low'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  created: 'created',
  active: 'active',
  completed: 'completed',
  failed: 'failed',
  cancelled: 'cancelled',
  expired: 'expired'
};

exports.ComplexityLevel = exports.$Enums.ComplexityLevel = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  expert: 'expert',
  undefined: 'undefined'
};

exports.AppPlanEnum = exports.$Enums.AppPlanEnum = {
  free: 'free',
  basic: 'basic',
  intermediate: 'intermediate',
  premium: 'premium',
  enterprise: 'enterprise',
  custom: 'custom'
};

exports.ReferralStatus = exports.$Enums.ReferralStatus = {
  pending: 'pending',
  converted: 'converted',
  abandoned: 'abandoned'
};

exports.AppRoleEnum = exports.$Enums.AppRoleEnum = {
  guest: 'guest',
  user: 'user',
  astroguide: 'astroguide',
  mentor: 'mentor',
  moderator: 'moderator',
  tenant_member: 'tenant_member',
  tenant_admin: 'tenant_admin',
  tenant_super_admin: 'tenant_super_admin',
  admin: 'admin',
  super_admin: 'super_admin',
  service_role: 'service_role'
};

exports.Prisma.ModelName = {
  AdDailyMetrics: 'AdDailyMetrics',
  AdPackages: 'AdPackages',
  AdVariants: 'AdVariants',
  Addresses: 'Addresses',
  Ads: 'Ads',
  AgentMetrics: 'AgentMetrics',
  BlacklistedDomains: 'BlacklistedDomains',
  BlacklistedUrls: 'BlacklistedUrls',
  BlockedIps: 'BlockedIps',
  BookmarkFolders: 'BookmarkFolders',
  Bookmarks: 'Bookmarks',
  Categories: 'Categories',
  CircuitBreakerStates: 'CircuitBreakerStates',
  Cities: 'Cities',
  ClassifiedUrls: 'ClassifiedUrls',
  Comments: 'Comments',
  Companies: 'Companies',
  CompanyContacts: 'CompanyContacts',
  CompanyEmployees: 'CompanyEmployees',
  CompanyExtras: 'CompanyExtras',
  CompanyMetrics: 'CompanyMetrics',
  CompanyUrls: 'CompanyUrls',
  Contacts: 'Contacts',
  ContentCategories: 'ContentCategories',
  ContentSourceVisits: 'ContentSourceVisits',
  ContentSources: 'ContentSources',
  ContentStatuses: 'ContentStatuses',
  ContentTags: 'ContentTags',
  Contents: 'Contents',
  Countries: 'Countries',
  CustomerPayments: 'CustomerPayments',
  CustomerProcessedWebhooks: 'CustomerProcessedWebhooks',
  CustomerRefunds: 'CustomerRefunds',
  CustomerSubscriptionPlans: 'CustomerSubscriptionPlans',
  CustomerSubscriptions: 'CustomerSubscriptions',
  EmbeddingReviews: 'EmbeddingReviews',
  ErrorLogs: 'ErrorLogs',
  FeatureRequests: 'FeatureRequests',
  FeatureVotes: 'FeatureVotes',
  FeedCategories: 'FeedCategories',
  FeedSources: 'FeedSources',
  Feedbacks: 'Feedbacks',
  Feeds: 'Feeds',
  Follows: 'Follows',
  JobConfigs: 'JobConfigs',
  JobLocks: 'JobLocks',
  JobMetrics: 'JobMetrics',
  JobQueueStats: 'JobQueueStats',
  JobVersions: 'JobVersions',
  MetricDefinitions: 'MetricDefinitions',
  News: 'News',
  NewsSummaries: 'NewsSummaries',
  NewsTags: 'NewsTags',
  Newsletters: 'Newsletters',
  PaymentProviders: 'PaymentProviders',
  PlanPermissions: 'PlanPermissions',
  Referrals: 'Referrals',
  ReferrerBlocks: 'ReferrerBlocks',
  Research: 'Research',
  ResearchEmbeddings: 'ResearchEmbeddings',
  Responses: 'Responses',
  RoleHierarchy: 'RoleHierarchy',
  RolePermissions: 'RolePermissions',
  RolePermissionsMaterialized: 'RolePermissionsMaterialized',
  ScoringWeights: 'ScoringWeights',
  Searches: 'Searches',
  SocialMedia: 'SocialMedia',
  SpiderMetrics: 'SpiderMetrics',
  StrapiMigrations: 'StrapiMigrations',
  StrapiMigrationsInternal: 'StrapiMigrationsInternal',
  TableMaintenanceLog: 'TableMaintenanceLog',
  TableStatistics: 'TableStatistics',
  Tags: 'Tags',
  UserMetrics: 'UserMetrics',
  UserProfiles: 'UserProfiles',
  Votes: 'Votes',
  WorkflowJobs: 'WorkflowJobs',
  Workflows: 'Workflows',
  Users: 'Users'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
