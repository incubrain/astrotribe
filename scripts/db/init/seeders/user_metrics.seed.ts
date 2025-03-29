import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedUserMetrics(pool: Pool, userIds: string[]) {
  const metrics = userIds.map((userId) => ({
    id: generateUUID(),
    user_id: userId,
    login_count: faker.number.int({ min: 1, max: 1000 }),
    last_login: faker.date.recent(),
    content_views: faker.number.int({ min: 0, max: 5000 }),
    comments_count: faker.number.int({ min: 0, max: 100 }),
    bookmarks_count: faker.number.int({ min: 0, max: 200 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'user_metrics', metrics)
  return metrics
}
