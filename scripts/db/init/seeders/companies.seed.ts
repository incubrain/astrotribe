import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ScrapeFrequency } from '../utils/types'

export async function seedCompanies(pool: Pool, count: number) {
  const companies = Array.from({ length: count }, () => {
    // Generate keywords as a properly formatted JSONB array
    const keywordsArray = faker.helpers.multiple(() => faker.word.sample(), { count: 5 })

    return {
      id: generateUUID(),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      logo_url: faker.image.url(),
      url: faker.internet.url(),
      social_media_id: faker.number.int({ min: 1, max: 100 }),
      scrape_frequency: faker.helpers.arrayElement([
        'four_times_daily',
        'twice_daily',
        'daily',
        'weekly',
        'bi_weekly',
        'monthly',
      ] as ScrapeFrequency[]),
      category_id: generateUUID(), // This should be a valid category UUID
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      founding_year: faker.number.int({ min: 1900, max: 2023 }),
      is_government: faker.datatype.boolean(),
      failed_count: faker.number.int({ min: 0, max: 5 }),
      is_english: faker.datatype.boolean(),
      scrape_rating: faker.number.int({ min: 0, max: 100 }),
      content_status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      keywords: JSON.stringify(keywordsArray), // Properly format as JSON string for JSONB
      job_url: faker.internet.url(),
    }
  })

  await bulkInsert(pool, 'companies', companies)
  return companies
}
