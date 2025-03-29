import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeedSources(pool: Pool, count: number) {
  const sources = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.company.name(),
    url: faker.internet.url(),
    description: faker.lorem.sentence(),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'feed_sources', sources)
  return sources
}
