import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeatureRequests(pool: Pool) {
  const requests = Array.from({ length: faker.number.int({ min: 10, max: 30 }) }, () => ({
    id: generateUUID(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['planned', 'in_progress', 'completed', 'rejected']),
    // Remove 'priority' field as it doesn't exist in the schema
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    // Add fields from schema that were missing
    upvotes: faker.number.int({ min: 0, max: 100 }),
    downvotes: faker.number.int({ min: 0, max: 20 }),
    engagement_score: faker.number.int({ min: 0, max: 1000 }),
    priority_score: faker.number.int({ min: 0, max: 1000 }),
  }))

  await bulkInsert(pool, 'feature_requests', requests)
  return requests
}
