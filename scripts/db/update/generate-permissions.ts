// src/cli/generate-permissions.ts
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs/promises'
import Pool from 'pg-pool'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
})

// Validate database connection string
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

interface TableGroup {
  description: string
  tables: string[]
  default_permissions: string[]
  requires_user_check?: boolean
  audit_level: 'low' | 'medium' | 'high' | 'critical'
}

interface TableGroups {
  [key: string]: TableGroup
}

function categorizeTable(tableName: string, schemas: any[]): string {
  // Reference tables
  if (
    [
      'categories',
      'cities',
      'countries',
      'tags',
      'content_categories',
      'content_tags',
      'metric_definitions',
    ].includes(tableName)
  ) {
    return 'reference_tables'
  }

  // Public content tables and their related tables
  if (
    ['companies', 'news', 'research', 'contents', 'newsletters', 'content_sources'].includes(
      tableName,
    ) ||
    tableName.endsWith('_summaries') ||
    tableName.endsWith('_embeddings') ||
    ['feed_sources', 'news_tags', 'content_statuses'].includes(tableName)
  ) {
    return 'public_content_tables'
  }

  // User content tables
  if (
    [
      'bookmarks',
      'bookmark_folders',
      'comments',
      'feeds',
      'feed_categories',
      'votes',
      'follows',
      'feedbacks',
      'user_followers',
      'feature_requests',
      'feature_votes',
    ].includes(tableName)
  ) {
    return 'user_content_tables'
  }

  // User data tables
  if (
    [
      'user_profiles',
      'addresses',
      'contacts',
      'searches',
      'user_metrics',
      'company_contacts',
      'company_employees',
      'company_extras',
      'company_urls',
      'company_metrics',
    ].includes(tableName)
  ) {
    return 'user_data_tables'
  }

  // Security tables
  if (
    tableName.includes('permission') ||
    tableName.includes('blacklist') ||
    tableName.includes('customer_') ||
    tableName.includes('payment') ||
    ['error_logs', 'role_hierarchy'].includes(tableName)
  ) {
    return 'security_tables'
  }

  // Advertising and analytics tables go to operational
  if (
    tableName.startsWith('ad_') ||
    tableName === 'ads' ||
    tableName.includes('_metrics') ||
    [
      'spider_metrics',
      'social_media',
      'embedding_reviews',
      'classified_urls',
      'content_source_visits',
      'responses',
    ].includes(tableName)
  ) {
    return 'operational_tables'
  }

  // Fallback to operational tables
  return 'operational_tables'
}

async function generatePermissions() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('Database connection successful')

    // Initialize table groups
    const tableGroups: TableGroups = {
      reference_tables: {
        description:
          'Read-only reference data accessible to all users. Contains foundational data that rarely changes and requires no user interaction.',
        tables: [],
        default_permissions: ['select'],
        audit_level: 'low',
      },
      public_content_tables: {
        description:
          "Publicly available content that forms the core of the platform's knowledge base. Readable by all, but creation and modification restricted to authorized users.",
        tables: [],
        default_permissions: ['select'],
        audit_level: 'medium',
      },
      user_content_tables: {
        description:
          'User-generated content and personalization features. These tables contain data created by users and require user-specific access controls.',
        tables: [],
        default_permissions: [],
        requires_user_check: true,
        audit_level: 'medium',
      },
      user_data_tables: {
        description:
          'Sensitive personal user information and account data. These tables contain private user information and require strict access controls.',
        tables: [],
        default_permissions: [],
        requires_user_check: true,
        audit_level: 'high',
      },
      operational_tables: {
        description:
          'Tables used for platform operations, monitoring, and content management. Contains data for running and maintaining the platform.',
        tables: [],
        default_permissions: [],
        audit_level: 'high',
      },
      security_tables: {
        description:
          'Critical system tables handling permissions, payments, and security. These tables contain highly sensitive data and require maximum security.',
        tables: [],
        default_permissions: [],
        audit_level: 'critical',
      },
    }

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '../generated')
    await fs.mkdir(outputDir, { recursive: true })

    console.log('Successfully generated role permissions configuration!')
  } catch (error: any) {
    console.error('Error generating permissions:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePermissions()
}

export { generatePermissions }
