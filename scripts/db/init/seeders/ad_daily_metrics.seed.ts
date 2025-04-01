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
    // Create a set to track variant_id + date combinations to avoid duplicates
    const usedCombinations = new Set<string>()

    // First check existing combinations in the database
    try {
      const { rows } = await pool.query('SELECT variant_id, date FROM ad_daily_metrics')
      rows.forEach((row) => {
        // Format the date as YYYY-MM-DD to normalize
        const dateStr = new Date(row.date).toISOString().split('T')[0]
        usedCombinations.add(`${row.variant_id}_${dateStr}`)
      })
      console.log(`Found ${usedCombinations.size} existing variant_id/date combinations`)
    } catch (err) {
      console.warn('Could not query existing ad_daily_metrics combinations')
    }

    const metrics = [] as {
      id: string
      variant_id: string
      date: Date
      views: number
      clicks: number
      created_at: Date
      updated_at: Date
    }[]

    // Generate metrics ensuring no duplicates
    for (const variantId of variantIds.slice(0, 1000)) {
      // Limit to 1000 variants to prevent excessive generation
      // Generate between 1-5 metrics per variant (reduced from 7-30 to minimize chance of conflicts)
      const numMetrics = faker.number.int({ min: 1, max: 5 })

      let metricsAdded = 0

      // Try to add the desired number of metrics for this variant
      for (let attempt = 0; attempt < 20 && metricsAdded < numMetrics; attempt++) {
        // Generate a random date within the last 30 days
        const date = faker.date.recent({ days: 30 })
        const dateStr = date.toISOString().split('T')[0]
        const key = `${variantId}_${dateStr}`

        // Skip if this combination already exists
        if (usedCombinations.has(key)) {
          continue
        }

        // Add to tracking set
        usedCombinations.add(key)
        metricsAdded++

        // Create the metric
        metrics.push({
          id: generateUUID(),
          variant_id: variantId,
          date: date,
          views: faker.number.int({ min: 100, max: 10000 }),
          clicks: faker.number.int({ min: 0, max: 1000 }),
          created_at: faker.date.past(),
          updated_at: faker.date.recent(),
        })
      }
    }

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
