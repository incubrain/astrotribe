import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContactType } from '../utils/types.js'

export async function seedContacts(pool: Pool, userIds: string[]) {
  if (userIds.length === 0) {
    console.warn('No users available for creating contacts')
    return []
  }

  console.log(`Generating contacts for ${userIds.length} users`)

  try {
    // Generate contacts based on the schema
    const privacyLevels = ['public', 'private', 'restricted']
    const contactTypes = ['personal', 'business', 'emergency', 'other']

    const contacts = userIds.flatMap((userId) =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: generateUUID(),
        title: faker.person.jobTitle(),
        is_primary: faker.datatype.boolean(),
        email: faker.internet.email(),
        contact_type: faker.helpers.arrayElement(contactTypes),
        privacy_level: faker.helpers.arrayElement(privacyLevels),
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
