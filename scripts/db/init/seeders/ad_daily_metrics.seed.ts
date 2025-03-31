import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAdDailyMetrics(pool: Pool, variantIds: string[]) {
  if (variantIds.length === 0) {
    console.warn('No ad variants available for creating ad daily metrics')
    return []
  }

  console.log(`Generating ad daily metrics for ${variantIds.length} ad variants`)

  try {
    const metrics = variantIds.flatMap((variantId) =>
      Array.from({ length: faker.number.int({ min: 7, max: 30 }) }, () => {
        const date = new Date(faker.date.recent({ days: 30 }))
        return {
          id: generateUUID(),
          variant_id: variantId,
          date: date,
          views: faker.number.int({ min: 100, max: 10000 }),
          clicks: faker.number.int({ min: 0, max: 1000 }),
          created_at: new Date(faker.date.past()),
          updated_at: new Date(faker.date.recent()),
        }
      }),
    )

    console.log(`Generated ${metrics.length} ad daily metrics`)

    // Log a sample metric for debugging
    if (metrics.length > 0) {
      console.log('Sample ad daily metric:', JSON.stringify(metrics[0], null, 2))
    }

    await bulkInsert(pool, 'ad_daily_metrics', metrics)
    return metrics
  } catch (error: any) {
    console.error('Error in seedAdDailyMetrics:', error)
    throw error
  }
}
