import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBookmarks(pool: Pool, userIds: string[], contentIds: string[]) {
  const bookmarks = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      content_id: faker.helpers.arrayElement(contentIds),
      content_type: faker.helpers.arrayElement(['article', 'news', 'research', 'job', 'company']),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'bookmarks', bookmarks)
  return bookmarks
}
