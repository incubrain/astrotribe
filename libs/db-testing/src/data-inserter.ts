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

// Function to get the next ID for a table (if needed)
async function getNextId(client: PoolClient, table: string): Promise<number> {
  const { rows } = await client.query(`
      SELECT last_value FROM ${table}_id_seq
    `)
  return parseInt(rows[0].last_value) + 1
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

async function insertReferenceData(client: PoolClient, insertedData: InsertedData) {
  // Insert categories
  const { rows: categories } = await client.query(
    `
    INSERT INTO categories (id, name)
    SELECT * FROM json_populate_recordset(null::categories, $1)
    RETURNING *
  `,
    [JSON.stringify(REFERENCE_DATA.categories)],
  )
  insertedData.categories = categories

  // Insert countries
  await client.query(
    `
    INSERT INTO countries (id, name, code, code_3)
    SELECT * FROM json_populate_recordset(null::countries, $1)
  `,
    [JSON.stringify(REFERENCE_DATA.countries)],
  )

  // Insert cities
  await client.query(
    `
    INSERT INTO cities (id, name, country_id)
    SELECT * FROM json_populate_recordset(null::cities, $1)
  `,
    [JSON.stringify(REFERENCE_DATA.cities)],
  )

  // Insert tags
  const { rows: tags } = await client.query(
    `
    INSERT INTO tags (id, name)
    SELECT * FROM json_populate_recordset(null::tags, $1)
    RETURNING *
  `,
    [JSON.stringify(REFERENCE_DATA.tags)],
  )
  insertedData.tags = tags
}

async function insertUserData(
  client: PoolClient,
  context: TestDataContext,
  insertedData: InsertedData,
) {
  const userData = generateTestData('user_profiles', context)
  const {
    rows: [user],
  } = await client.query(
    `
    INSERT INTO user_profiles (
      id, email, given_name, surname, username, role, plan
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
    [
      userData.id,
      userData.email,
      userData.given_name,
      userData.surname,
      userData.username,
      userData.role,
      userData.plan,
    ],
  )
  insertedData.users.push(user)
}

async function insertContentData(
  client: PoolClient,
  context: TestDataContext,
  insertedData: InsertedData,
) {
  // Insert content
  const contentData = generateTestData('contents', context, {
    content_type: 'news',
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
  })

  const {
    rows: [content],
  } = await client.query(
    `
    INSERT INTO contents (
      content_type, url, title
    ) VALUES ($1, $2, $3)
    RETURNING *
  `,
    [contentData.content_type, contentData.url, contentData.title],
  )

  insertedData.contents.push(content)
  context.contentIds.news = content.id

  // Insert news
  const newsData = generateTestData('news', context, {
    id: content.id,
    title: content.title,
    category_id: context.categoryIds[0],
  })

  await client.query(
    `
    INSERT INTO news (
      id, title, category_id, url
    ) VALUES ($1, $2, $3, $4)
  `,
    [newsData.id, newsData.title, newsData.category_id, contentData.url],
  )
}

async function insertUserGeneratedContent(
  client: PoolClient,
  context: TestDataContext,
  insertedData: InsertedData,
) {
  // Insert bookmarks
  const bookmarkData = generateTestData('bookmarks', context)
  await client.query(
    `
    INSERT INTO bookmarks (
      user_id, content_id, content_type
    ) VALUES ($1, $2, $3)
  `,
    [bookmarkData.user_id, bookmarkData.content_id, bookmarkData.content_type],
  )

  // Insert comments
  const commentData = generateTestData('comments', context)
  await client.query(
    `
    INSERT INTO comments (
      user_id, content_id, content_type, content
    ) VALUES ($1, $2, $3, $4)
  `,
    [commentData.user_id, commentData.content_id, commentData.content_type, commentData.content],
  )

  // Add other user-generated content insertions
}
