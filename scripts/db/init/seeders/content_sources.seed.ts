import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ScrapeFrequency } from '../utils/types.js'

export async function seedContentSources(pool: Pool, count: number) {
  const sources = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.company.name(),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
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

  await bulkInsert(pool, 'content_sources', sources)
  return sources
}
