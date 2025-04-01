import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedNewsletters(
  pool: Pool,
  contentIds: string[] = [],
  companyIds: string[] = [],
) {
  // Check if we have the required parameters
  if (!contentIds || contentIds.length === 0) {
    console.warn('No content IDs available for creating newsletters')

    try {
      // Try to get some content IDs from the database
      const { rows } = await pool.query(`
        SELECT id FROM contents 
        WHERE content_type = 'newsletter' OR content_type = 'article'
        LIMIT 20
      `)

      if (rows.length > 0) {
        contentIds = rows.map((row) => row.id)
        console.log(`Found ${contentIds.length} content IDs from database`)
      } else {
        console.warn('No content found for newsletters')
        return []
      }
    } catch (err) {
      console.warn('Could not get content IDs for newsletters')
      return []
    }
  }

  if (!companyIds || companyIds.length === 0) {
    try {
      // Try to get some company IDs from the database
      const { rows } = await pool.query('SELECT id FROM companies LIMIT 20')

      if (rows.length > 0) {
        companyIds = rows.map((row) => row.id)
        console.log(`Found ${companyIds.length} company IDs from database`)
      } else {
        console.warn('No companies found for newsletters')
        return []
      }
    } catch (err) {
      console.warn('Could not get company IDs for newsletters')
      return []
    }
  }

  if (contentIds.length === 0 || companyIds.length === 0) {
    console.warn('Not enough data to create newsletters')
    return []
  }

  console.log(
    `Generating newsletters with ${contentIds.length} content items and ${companyIds.length} companies`,
  )

  try {
    // Query for valid content_status enum values
    let contentStatusValues = ['draft', 'scheduled', 'published', 'archived']
    try {
      const { rows: enumValues } = await pool.query(
        'SELECT unnest(enum_range(NULL::content_status)) as enum_value',
      )
      if (enumValues.length > 0) {
        contentStatusValues = enumValues.map((row) => row.enum_value)
        console.log('Valid content_status values:', contentStatusValues)
      }
    } catch (err) {
      console.warn('Could not get content_status enum values, using defaults')
    }

    // Generate newsletters with proper frequencies and date ranges
    const frequencies = ['daily', 'weekly', 'monthly', 'quarterly']

    const newsletters = Array.from({ length: Math.min(contentIds.length, 15) }, () => {
      const startDate = new Date(faker.date.past())
      const endDate = faker.helpers.maybe(() => new Date(faker.date.future()), { probability: 0.3 })

      return {
        id: generateUUID(),
        title: faker.lorem.sentence(),
        frequency: faker.helpers.arrayElement(frequencies),
        start_date: startDate,
        end_date: endDate,
        generated_content: faker.lorem.paragraphs(3),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        content_status: faker.helpers.arrayElement(contentStatusValues),
      }
    })

    console.log(`Generated ${newsletters.length} newsletters`)

    // Log a sample newsletter for debugging
    if (newsletters.length > 0) {
      console.log('Sample newsletter:', JSON.stringify(newsletters[0], null, 2))
    }

    await bulkInsert(pool, 'newsletters', newsletters)
    return newsletters
  } catch (error: any) {
    console.error('Error in seedNewsletters:', error)
    throw error
  }
}
