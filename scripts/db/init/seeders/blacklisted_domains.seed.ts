import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBlacklistedDomains(pool: Pool, count: number = 30) {
  const blacklistReasons = [
    'Spam/Malware',
    'Phishing attempt',
    'Content policy violation',
    'Hateful content',
    'Competitor site',
    'Adult content',
    'Dangerous content',
    'Known bad actor',
    'User reported',
  ]

  const blacklistedDomains = Array.from({ length: count }, () => {
    // Generate a realistic-looking domain
    const domainName = faker.internet.domainName()

    return {
      id: generateUUID(),
      created_at: faker.date.past(),
      url: domainName,
      reason: faker.helpers.arrayElement(blacklistReasons),
    }
  })

  await bulkInsert(pool, 'blacklisted_domains', blacklistedDomains)
  return blacklistedDomains
}
