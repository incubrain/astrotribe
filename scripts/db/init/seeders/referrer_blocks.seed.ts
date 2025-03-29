import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedReferrerBlocks(pool: Pool, referrerIds: string[]) {
  const blocks = referrerIds.map((referrerId) => ({
    id: generateUUID(),
    referrer_id: referrerId,
    reason: faker.lorem.sentence(),
    blocked_until: faker.date.future(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'referrer_blocks', blocks)
  return blocks
}
