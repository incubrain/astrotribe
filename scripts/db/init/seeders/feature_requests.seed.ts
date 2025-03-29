import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { Priority } from '../utils/types.js'

export async function seedFeatureRequests(pool: Pool, userIds: string[]) {
  const requests = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      priority: faker.helpers.arrayElement([
        'very_low',
        'low',
        'medium',
        'high',
        'critical',
      ] as Priority[]),
      status: faker.helpers.arrayElement([
        'new',
        'under_review',
        'planned',
        'in_progress',
        'completed',
        'rejected',
      ]),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'feature_requests', requests)
  return requests
}
