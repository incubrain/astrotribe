import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { FeedbackStatus, FeedbackType, Priority } from '../utils/types.js'

export async function seedFeedback(pool: Pool, userIds: string[]) {
  const feedback = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      feedback_type: faker.helpers.arrayElement([
        'bug_report',
        'feature_request',
        'user_interface_issue',
        'performance_issue',
        'documentation',
      ] as FeedbackType[]),
      status: faker.helpers.arrayElement([
        'new',
        'under_review',
        'backlog',
        'working_on',
        'resolved',
        'rejected',
        'deferred',
      ] as FeedbackStatus[]),
      priority: faker.helpers.arrayElement([
        'very_low',
        'low',
        'medium',
        'high',
        'critical',
      ] as Priority[]),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'feedback', feedback)
  return feedback
}
