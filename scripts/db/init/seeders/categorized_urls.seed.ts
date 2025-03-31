import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedCategorizedURLs(
  pool: Pool,
  companyIds: string[] = [],
  domainIds: string[] = [],
  count: number = 100,
) {
  const categorizerVersions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0', '2.1.0']

  // Handle case when domain IDs are not available
  if (domainIds.length === 0) {
    // Query existing domain IDs from the database
    try {
      const { rows } = await pool.query('SELECT id FROM business_domains LIMIT 100')
      if (rows.length > 0) {
        domainIds = rows.map((row) => row.id)
      } else {
        // If still no domains, create a dummy domain
        const dummyDomainId = generateUUID()
        console.log(
          `No business domains found in database. Using dummy domain ID: ${dummyDomainId}`,
        )
        domainIds = [dummyDomainId]
      }
    } catch (error: any) {
      console.error('Error fetching business domains:', error)
      // Create a dummy domain ID
      const dummyDomainId = generateUUID()
      console.log(`Error fetching domains. Using dummy domain ID: ${dummyDomainId}`)
      domainIds = [dummyDomainId]
    }
  }

  const categorizedURLs = Array.from({ length: count }, () => {
    const domain = faker.internet.domainName()
    const path = faker.system.filePath()
    const url = `https://${domain}${path}`

    // Only add company_id field if companies are available
    const companyField =
      companyIds.length > 0 ? { company_id: faker.helpers.arrayElement(companyIds) } : {}

    return {
      id: generateUUID(),
      domain_id: faker.helpers.arrayElement(domainIds),
      confidence: faker.number.float({ min: 0.6, max: 1.0, fractionDigits: 2 }),
      categorizer_version: faker.helpers.arrayElement(categorizerVersions),
      created_at: faker.date.past(),
      found_on: faker.helpers.maybe(() => `https://${faker.internet.domainName()}`, {
        probability: 0.7,
      }),
      url,
      // The priority column is of type 'priority' (enum)
      // Valid values: very_low, low, medium, high, critical
      priority: faker.helpers.arrayElement(['very_low', 'low', 'medium', 'high', 'critical']),
      content_error_count: faker.number.int({ min: 0, max: 5 }),
      error_count: faker.number.int({ min: 0, max: 10 }),
      last_content_error: faker.helpers.maybe(() => `Error: ${faker.lorem.sentence()}`, {
        probability: 0.3,
      }),
      last_error: faker.helpers.maybe(() => `Error: ${faker.lorem.sentence()}`, {
        probability: 0.3,
      }),
      content_hash: faker.helpers.maybe(() => faker.git.commitSha(), { probability: 0.8 }),
      updated_at: faker.date.recent(),
      ...companyField,
    }
  })

  await bulkInsert(pool, 'categorized_urls', categorizedURLs)
  return categorizedURLs
}
