import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContactType } from '../utils/types.js'

export async function seedContacts(pool: Pool, companyIds: string[]) {
  const contacts = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      company_id: companyId,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      title: faker.person.jobTitle(),
      contact_type: faker.helpers.arrayElement([
        'personal',
        'company',
        'professional',
        'recruitment',
        'founder',
      ] as ContactType[]),
      is_primary: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'contacts', contacts)
  return contacts
}
