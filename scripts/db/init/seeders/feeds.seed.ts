import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeeds(pool: Pool, userIds: string[]) {
  const feeds = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
    id: generateUUID(),
    created_at: faker.date.past(),
    name: faker.word.noun(),
    user_id: faker.helpers.arrayElement(userIds),
  }))

  await bulkInsert(pool, 'feeds', feeds)
  return feeds
}
