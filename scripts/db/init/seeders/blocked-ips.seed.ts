import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBlockedIPs(pool: Pool, count: number) {
  const blockedIPs = Array.from({ length: count }, () => ({
    id: generateUUID(),
    ip_address: faker.internet.ip(),
    reason: faker.lorem.sentence(),
    blocked_until: faker.date.future(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'blocked_ips', blockedIPs)
  return blockedIPs
}
