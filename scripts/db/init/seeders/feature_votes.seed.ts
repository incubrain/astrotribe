import type { Pool } from 'pg'
import { faker } from '@faker-js/faker'
import { bulkInsert, generateUUID } from '../utils'

export async function seedFeatureVotes(pool: Pool, userIds: string[], featureRequestIds: string[]) {
  const votes = featureRequestIds.flatMap((requestId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
      id: generateUUID(),
      user_id: faker.helpers.arrayElement(userIds),
      feature_request_id: requestId,
      vote_type: faker.helpers.arrayElement(['upvote', 'downvote']),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'feature_votes', votes)
  return votes
}
