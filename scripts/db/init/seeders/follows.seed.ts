import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { FollowedEntity, PrivacyLevel } from '../utils/types.js'

export async function seedFollows(pool: Pool, userIds: string[], companyIds: string[]) {
  const follows = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      follower_id: userId,
      followed_id: faker.helpers.arrayElement(companyIds),
      followed_type: faker.helpers.arrayElement(['company', 'user'] as FollowedEntity[]),
      privacy_level: faker.helpers.arrayElement([
        'private',
        'connected',
        'public',
      ] as PrivacyLevel[]),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'follows', follows)
  return follows
}
