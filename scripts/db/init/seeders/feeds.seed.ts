import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ScrapeFrequency } from '../utils/types.js'

export async function seedFeeds(pool: Pool, categoryIds: string[], sourceIds: string[]) {
  const feeds = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
    id: generateUUID(),
    category_id: faker.helpers.arrayElement(categoryIds),
    source_id: faker.helpers.arrayElement(sourceIds),
    name: faker.word.noun(),
    description: faker.lorem.sentence(),
    url: faker.internet.url(),
    scrape_frequency: faker.helpers.arrayElement([
      'daily',
      'weekly',
      'monthly',
      'quarterly',
      'never',
    ] as ScrapeFrequency[]),
    last_scraped_at: faker.date.past(),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'feeds', feeds)
  return feeds
}
