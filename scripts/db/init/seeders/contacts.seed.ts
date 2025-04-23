import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContacts(pool: Pool, userIds: string[]) {
  if (userIds.length === 0) {
    console.warn('No users available for creating contacts')
    return []
  }

  console.log(`Generating contacts for ${userIds.length} users`)

  try {
    // First, get the valid enum values directly from the database
    let validContactTypes = ['personal', 'company', 'professional', 'recruitment', 'founder']
    let validPrivacyLevels = ['private', 'connected', 'public']

    try {
      const { rows: contactTypeEnum } = await pool.query(`
        SELECT unnest(enum_range(NULL::contact_type)) as enum_value
      `)

      if (contactTypeEnum.length > 0) {
        validContactTypes = contactTypeEnum.map((row) => row.enum_value)
        console.log('Valid contact_type values:', validContactTypes)
      }

      const { rows: privacyEnum } = await pool.query(`
        SELECT unnest(enum_range(NULL::privacy_level)) as enum_value
      `)

      if (privacyEnum.length > 0) {
        validPrivacyLevels = privacyEnum.map((row) => row.enum_value)
        console.log('Valid privacy_level values:', validPrivacyLevels)
      }
    } catch (err) {
      console.warn('Error fetching enum values, using defaults')
    }

   

    // Generate contacts using the valid enum values
    const contacts = userIds.flatMap((userId, idx) =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, innerIdx) => ({
        id: generateUUID(),
        title: faker.person.jobTitle(),
        is_primary: faker.datatype.boolean(),
        email: faker.internet.email(),
        contact_type: faker.helpers.arrayElement(validContactTypes),
        privacy_level: faker.helpers.arrayElement(validPrivacyLevels),
        user_id: userId,
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
        phone: faker.phone.number(),
      })),
    )

    console.log(`Generated ${contacts.length} contacts`)

    // Log a sample contact for debugging
    if (contacts.length > 0) {
      console.log('Sample contact:', JSON.stringify(contacts[0], null, 2))
    }

    await bulkInsert(pool, 'contacts', contacts)
    return contacts
  } catch (error: any) {
    console.error('Error in seedContacts:', error)
    throw error
  }
}
