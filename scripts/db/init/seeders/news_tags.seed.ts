import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedNewsTags(pool: Pool, newsIds: string[], tagIds: string[]) {
  const newsTags = newsIds.flatMap((newsId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      news_id: newsId,
      tag_id: faker.helpers.arrayElement(tagIds),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'news_tags', newsTags)
  return newsTags
}
