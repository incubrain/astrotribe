// src/db-testing/data-inserter.ts
import type { Pool, PoolClient } from 'pg'
import { faker } from '@faker-js/faker'
import type { InsertedData, TestDataContext } from './types'
import { generateTestData } from './data-generator'
import { REFERENCE_DATA, TEST_USERS } from './constants'

export async function insertTestData(pool: Pool): Promise<InsertedData> {
  const client = await pool.connect()
  const insertedData: InsertedData = {
    categories: [],
    countries: [],
    cities: [],
    contents: [],
    users: [],
    tags: [],
  }

  try {
    await client.query('BEGIN')

    // Insert categories and capture the generated IDs
    console.log('Inserting categories...')
    const { rows: categories } = await client.query(
      `
        INSERT INTO categories (name)
        VALUES ${REFERENCE_DATA.categories.map((_, i) => `($${i + 1})`).join(',')}
        RETURNING *
        `,
      REFERENCE_DATA.categories.map((cat) => cat.name),
    )

    insertedData.categories = categories
    console.log('Inserted categories:', categories)

    // Insert countries with specific IDs
    console.log('Inserting countries...')
    const { rows: countries } = await client.query(
      `
        INSERT INTO countries (id, name, code, code_3)
        VALUES ${REFERENCE_DATA.countries
          .map((_, i) => {
            const offset = i * 4
            return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`
          })
          .join(',')}
        RETURNING *
        `,
      REFERENCE_DATA.countries.flatMap((country) => [
        country.id,
        country.name,
        country.code,
        country.code_3,
      ]),
    )

    insertedData.countries = countries

    // Insert cities with specific IDs
    console.log('Inserting cities...')
    const { rows: cities } = await client.query(
      `
        INSERT INTO cities (id, name, country_id)
        VALUES ${REFERENCE_DATA.cities
          .map((_, i) => {
            const offset = i * 3
            return `($${offset + 1}, $${offset + 2}, $${offset + 3})`
          })
          .join(',')}
        RETURNING *
        `,
      REFERENCE_DATA.cities.flatMap((city) => [city.id, city.name, city.country_id]),
    )

    insertedData.cities = cities

    await client.query('COMMIT')
    console.log('Reference data inserted successfully')
    return insertedData
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error inserting reference data:', error)
    throw error
  } finally {
    client.release()
  }
}

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
