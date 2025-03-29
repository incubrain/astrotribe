import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedCompanyContacts(
  pool: Pool,
  companyIds: string[],
  contactIds: string[],
  count: number = 50,
) {
  // Check if we have enough contacts and companies
  if (contactIds.length === 0 || companyIds.length === 0) {
    console.warn('No contacts or companies to create company_contacts relationships')
    return []
  }

  // Generate unique combinations of company_id and contact_id
  const companyContactPairs = new Set()

  // Create a mapping to ensure we don't create duplicates
  while (companyContactPairs.size < Math.min(count, companyIds.length * contactIds.length)) {
    const companyId = faker.helpers.arrayElement(companyIds)
    const contactId = faker.helpers.arrayElement(contactIds)
    companyContactPairs.add(`${companyId}-${contactId}`)
  }

  const companyContacts = [...companyContactPairs].map((pair, index) => {
    const [companyId, contactId] = (pair as string).split('-')

    return {
      id: index + 1, // Using sequential IDs since the schema uses integer
      contact_id: parseInt(contactId, 10),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      company_id: companyId,
    }
  })

  await bulkInsert(pool, 'company_contacts', companyContacts)
  return companyContacts
}
