import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

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

  console.log(
    `Generating company contacts with ${companyIds.length} companies and ${contactIds.length} contacts`,
  )

  try {
    // Generate unique combinations of company_id and contact_id
    const companyContactPairs = new Set()

    // Create a mapping to ensure we don't create duplicates
    while (companyContactPairs.size < Math.min(count, companyIds.length * contactIds.length)) {
      const companyId = faker.helpers.arrayElement(companyIds)
      const contactId = faker.helpers.arrayElement(contactIds)
      companyContactPairs.add(`${companyId}-${contactId}`)
    }

    const companyContacts = [...companyContactPairs].map((pair) => {
      const [companyId, contactId] = (pair as string).split('-')

      return {
        id: generateUUID(),
        contact_id: contactId,
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        company_id: companyId,
        // Note: The schema has a duplicate company_id column which is problematic.
        // We're only setting one company_id field as the database should handle this correctly.
      }
    })

    console.log(`Generated ${companyContacts.length} company contacts`)

    // Log a sample company contact for debugging
    if (companyContacts.length > 0) {
      console.log('Sample company contact:', JSON.stringify(companyContacts[0], null, 2))
    }

    await bulkInsert(pool, 'company_contacts', companyContacts)
    return companyContacts
  } catch (error: any) {
    console.error('Error in seedCompanyContacts:', error)
    throw error
  }
}
