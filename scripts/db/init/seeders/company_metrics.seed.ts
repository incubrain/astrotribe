import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedCompanyMetrics(
  pool: Pool,
  companyIds: string[],
  metricDefinitionIds: number[] = [],
  count: number = 200,
) {
  if (companyIds.length === 0) {
    console.warn('No companies available to seed company_metrics')
    return []
  }

  // If no metric definitions were provided, create some default metric types
  const defaultMetricTypes = [
    { id: 1, name: 'employee_count', unit: 'count' },
    { id: 2, name: 'revenue', unit: 'usd' },
    { id: 3, name: 'funding_total', unit: 'usd' },
    { id: 4, name: 'customer_count', unit: 'count' },
    { id: 5, name: 'customer_satisfaction', unit: 'score' },
    { id: 6, name: 'engagement_rate', unit: 'percentage' },
    { id: 7, name: 'growth_rate', unit: 'percentage' },
    { id: 8, name: 'market_share', unit: 'percentage' },
    { id: 9, name: 'social_media_followers', unit: 'count' },
    { id: 10, name: 'web_traffic', unit: 'visits' },
  ]

  // Use provided metric definition IDs or default ones
  const metricIds =
    metricDefinitionIds.length > 0
      ? metricDefinitionIds
      : defaultMetricTypes.map((metric) => metric.id)

  const metrics = Array.from({ length: count }, (_, index) => {
    const metricId = faker.helpers.arrayElement(metricIds)
    const companyId = faker.helpers.arrayElement(companyIds)
    const timestamp = faker.date.recent()

    // Generate different value formats based on metric type
    let value
    const metricType = defaultMetricTypes.find((m) => m.id === metricId)?.unit || 'count'

    switch (metricType) {
      case 'usd':
        value = {
          amount: faker.number.float({ min: 10000, max: 100000000, fractionDigits: 2 }),
          currency: 'USD',
          date: timestamp.toISOString().split('T')[0],
        }
        break
      case 'percentage':
        value = {
          value: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
          previous_value: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
          change: faker.number.float({ min: -50, max: 50, fractionDigits: 2 }),
        }
        break
      case 'score':
        value = {
          score: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
          responses: faker.number.int({ min: 10, max: 1000 }),
          source: faker.helpers.arrayElement(['survey', 'nps', 'reviews', 'feedback']),
        }
        break
      default:
        value = {
          count: faker.number.int({ min: 1, max: 100000 }),
          previous_count: faker.number.int({ min: 1, max: 100000 }),
          trend: faker.helpers.arrayElement(['increasing', 'decreasing', 'stable']),
        }
    }

    return {
      id: BigInt(index + 1), // Using index for id as schema uses bigint
      crawl_id: faker.string.uuid(),
      company_id: companyId,
      metric_id: metricId,
      timestamp: timestamp,
      value: value,
    }
  })

  await bulkInsert(pool, 'company_metrics', metrics)
  return metrics
}
