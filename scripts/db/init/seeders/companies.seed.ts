import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ScrapeFrequency } from '../utils/types'

export async function seedCompanies(pool: Pool, count: number) {
  // First, get the available social media IDs from the database
  let socialMediaIds: number[] = []
  try {
    const { rows } = await pool.query('SELECT id FROM social_media')
    if (rows.length > 0) {
      socialMediaIds = rows.map((row) => row.id)
    } else {
      console.warn('No social media entries found, creating companies without social_media_id')
    }
  } catch (error: any) {
    console.error('Error fetching social media IDs:', error)
  }

  // Get valid category IDs
  let categoryIds: string[] = []
  try {
    const { rows } = await pool.query('SELECT id FROM categories')
    if (rows.length > 0) {
      categoryIds = rows.map((row) => row.id)
    } else {
      console.warn('No categories found, using random UUIDs for category_id')
    }
  } catch (error: any) {
    console.error('Error fetching category IDs:', error)
  }

  const companies = Array.from({ length: count }, () => {
    // Base company object
    const company: any = {
      id: generateUUID(),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      logo_url: faker.image.url(),
      url: faker.internet.url(),
      scrape_frequency: faker.helpers.arrayElement([
        'four_times_daily',
        'twice_daily',
        'daily',
        'weekly',
        'bi_weekly',
        'monthly',
      ] as ScrapeFrequency[]),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      founding_year: faker.number.int({ min: 1900, max: 2023 }),
      is_government: faker.datatype.boolean(),
      content_status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      job_url: faker.internet.url(),
    }

    // Add social_media_id only if we have valid IDs
    if (socialMediaIds.length > 0) {
      company.social_media_id = faker.helpers.arrayElement(socialMediaIds)
    }

    // Add category_id using a valid ID if available, otherwise generate a random UUID
    company.category_id =
      categoryIds.length > 0 ? faker.helpers.arrayElement(categoryIds) : generateUUID()

    return company
  })

  await bulkInsert(pool, 'companies', companies)
  return companies
}
