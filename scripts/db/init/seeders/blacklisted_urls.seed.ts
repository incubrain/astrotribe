import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedBlacklistedURLs(
  pool: Pool,
  companyIds: string[] = [],
  count: number = 50,
) {
  // Generate random URLs with specific paths
  const blacklistReasons = [
    'Spam content',
    'Phishing page',
    'Malware distribution',
    'Content policy violation',
    'Competitor page',
    'Adult content',
    'Harmful information',
    'Invalid information',
    'User reported',
  ]

  const urlPaths = [
    '/downloads',
    '/promotions',
    '/offers',
    '/free',
    '/login',
    '/signup',
    '/special-offer',
    '/discount',
    '/win',
    '/click',
    '/redirect',
  ]

  const blacklistedURLs = Array.from({ length: count }, (_, index) => {
    // Generate a realistic-looking URL with a suspicious path
    const domain = faker.internet.domainName()
    const path = faker.helpers.arrayElement(urlPaths)
    const queryParams = faker.helpers.maybe(
      () => `?${faker.internet.domainWord()}=${faker.internet.domainWord()}`,
      { probability: 0.7 },
    )

    const companyEntry =
      companyIds.length > 0 ? { company_id: faker.helpers.arrayElement(companyIds) } : {} // Only add company_id if we have companies

    return {
      id: index + 1, // Using index for id since the schema uses integer
      url: `https://${domain}${path}${queryParams || ''}`,
      reason: faker.helpers.arrayElement(blacklistReasons),
      created_at: faker.date.past(),
      ...companyEntry,
    }
  })

  await bulkInsert(pool, 'blacklisted_urls', blacklistedURLs)
  return blacklistedURLs
}
