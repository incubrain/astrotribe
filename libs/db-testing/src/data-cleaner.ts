// src/db-testing/data-cleanup.ts
import type { Pool } from 'pg'

export async function cleanUpTestData(pool: Pool) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Delete in reverse dependency order
    const tables = [
      'comments',
      'contacts',
      'addresses',
      'company_employees',
      'content_sources',
      'bookmarks',
      'bookmark_folders',
      'news',
      'newsletters',
      'contents',
      'cities',
      'countries',
      'categories',
      'tags',
      'news_tags',
      'content_tags',
      'social_media',
      'follows',
      'feedbacks',
      'votes',
      'user_metrics',
      'user_followers',
      'feature_requests',
      'feature_rankings',
      'content_source_visits',
      'error_logs',
      'ads',
      'ad_daily_metrics',
      'ad_packages',
      'ad_variants',
    ]

    for (const table of tables) {
      try {
        console.log(`Cleaning up ${table}...`)
        await client.query(`TRUNCATE TABLE "${table}" CASCADE`)

        // Reset sequence if it exists
        await client.query(`
            DO $$
            BEGIN
              IF EXISTS (SELECT 1 FROM pg_class WHERE relname = '${table}_id_seq') THEN
                PERFORM setval('${table}_id_seq', 1, false);
              END IF;
            END $$;
          `)
      } catch (error) {
        console.warn(`Warning: Could not clean up table ${table}:`, error)
      }
    }

    await client.query('COMMIT')
    console.log('Test data cleanup completed successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
