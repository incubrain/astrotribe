import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContentSourceVisits(pool: Pool, contentSourceIds: string[]) {
  const visits = contentSourceIds.flatMap((sourceId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      content_source_id: sourceId,
      visit_date: faker.date.past(),
      visit_count: faker.number.int({ min: 1, max: 100 }),
      last_visit: faker.date.recent(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'content_source_visits', visits)
  return visits
}
