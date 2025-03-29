import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from './helpers'

export async function seedAdDailyMetrics(pool: Pool, variantIds: string[]) {
  const metrics = variantIds.flatMap((variantId) =>
    Array.from({ length: faker.number.int({ min: 7, max: 30 }) }, () => ({
      id: generateUUID(),
      variant_id: variantId,
      date: faker.date.past(),
      views: faker.number.int({ min: 100, max: 10000 }),
      clicks: faker.number.int({ min: 0, max: 1000 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'ad_daily_metrics', metrics)
  return metrics
}
