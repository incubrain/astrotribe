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
    // Check if the contact_id column in company_contacts is of type integer or UUID
    let contactIdIsInteger = false
    try {
      const { rows } = await pool.query(`
        SELECT data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'company_contacts' 
        AND column_name = 'contact_id'
      `)

      if (rows.length > 0) {
        const dataType = rows[0].data_type === 'USER-DEFINED' ? rows[0].udt_name : rows[0].data_type
        contactIdIsInteger = dataType === 'integer'
        console.log(`contact_id column type: ${dataType} (is integer: ${contactIdIsInteger})`)
      }
    } catch (err) {
      console.warn('Could not determine contact_id column type, assuming uuid')
    }

    // If contact_id is an integer, we need to get integer IDs
    let contactIntIds: number[] = []
    if (contactIdIsInteger) {
      try {
        // Try to get actual contacts with integer IDs
        const { rows } = await pool.query('SELECT id AS contact_id FROM contacts LIMIT 100')
        if (rows.length > 0) {
          contactIntIds = rows.map((row) => parseInt(row.contact_id, 10))
          console.log(`Found ${contactIntIds.length} integer contact IDs`)
        } else {
          // Generate sequential IDs as fallback
          contactIntIds = Array.from({ length: Math.min(100, count) }, (_, i) => i + 1)
          console.log('No contact IDs found, using sequential integers')
        }
      } catch (err) {
        // Generate sequential IDs as fallback
        contactIntIds = Array.from({ length: Math.min(100, count) }, (_, i) => i + 1)
        console.log('Error fetching contact IDs, using sequential integers')
      }
    }

    // Generate unique combinations of company_id and contact_id
    const companyContactPairs = new Set()

    // Create a mapping to ensure we don't create duplicates
    while (
      companyContactPairs.size <
      Math.min(
        count,
        companyIds.length * (contactIdIsInteger ? contactIntIds.length : contactIds.length),
      )
    ) {
      const companyId = faker.helpers.arrayElement(companyIds)
      const contactId = contactIdIsInteger
        ? faker.helpers.arrayElement(contactIntIds)
        : faker.helpers.arrayElement(contactIds)

      companyContactPairs.add(`${companyId}-${contactId}`)
    }

    const companyContacts = [...companyContactPairs].map((pair) => {
      const [companyId, contactId] = (pair as string).split('-')

      return {
        id: generateUUID(),
        contact_id: contactId, // This will be either a number or UUID string
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        company_id: companyId,
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
