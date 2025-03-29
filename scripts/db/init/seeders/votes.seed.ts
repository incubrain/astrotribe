import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedVotes(pool: Pool, userIds: string[], contentIds: string[]) {
  const votes = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
      id: generateUUID(),
      user_id: faker.helpers.arrayElement(userIds),
      content_id: contentId,
      vote_type: faker.helpers.arrayElement(['upvote', 'downvote']),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'votes', votes)
  return votes
}
