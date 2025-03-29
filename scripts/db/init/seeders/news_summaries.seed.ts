import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedNewsSummaries(pool: Pool, newsIds: string[]) {
  const summaries = newsIds.map((newsId) => ({
    id: generateUUID(),
    news_id: newsId,
    summary: faker.lorem.paragraph(),
    key_points: faker.helpers.multiple(() => faker.lorem.sentence(), { count: 3 }),
    sentiment: faker.helpers.arrayElement(['positive', 'negative', 'neutral']),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'news_summaries', summaries)
  return summaries
}
