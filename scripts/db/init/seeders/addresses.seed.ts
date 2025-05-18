import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAddresses(
  pool: Pool,
  companyIds: string[] = [],
  userIds: string[] = [],
) {
  // Only proceed if we have companies and users
  if (companyIds.length === 0 || userIds.length === 0) {
    console.warn('Could not create addresses: missing company or user IDs')
    return []
  }

  // Query for valid address_type enum values
  let validAddressTypes = [
    'residential',
    'headquarters',
    'office',
    'factory',
    'lab',
    'warehouse',
    'research',
    'retail',
    'showroom',
    'branch',
  ]
  try {
    const { rows: enumValues } = await pool.query(
      'SELECT unnest(enum_range(NULL::address_type)) as enum_value',
    )
    if (enumValues.length > 0) {
      validAddressTypes = enumValues.map((row) => row.enum_value)
      console.log('Valid address_type values:', validAddressTypes)
    }
  } catch (err) {
    console.warn('Could not get address_type enum values, using defaults')
  }

  const numberOfAddresses = faker.number.int({ min: 10, max: 30 })
  const addresses = [] as {
    id: string
    user_id: string
    company_id: string
    address_type?: string
    is_primary: boolean
    name?: string
    full_address: string
    address_line1: string
    address_line2?: string
    city: string
    state: string
    postal_code: string
    country: string
    country_code: string
    latitude: number
    longitude: number
    created_at: Date
    updated_at: Date
  }[]

  for (let i = 0; i < numberOfAddresses; i++) {
    addresses.push({
      id: generateUUID(),
      user_id: faker.helpers.arrayElement(userIds),
      company_id: faker.helpers.arrayElement(companyIds),
      address_type: faker.helpers.maybe(() => faker.helpers.arrayElement(validAddressTypes), {
        probability: 0.7,
      }),
      is_primary: faker.datatype.boolean(),
      name: faker.helpers.maybe(() => faker.company.name(), { probability: 0.5 }),
      full_address: faker.location.streetAddress(),
      address_line1: faker.location.streetAddress(),
      address_line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
      city: faker.location.city(),
      state: faker.location.state(),
      postal_code: faker.location.zipCode(),
      country: faker.location.country(),
      country_code: faker.location.countryCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })
  }

  await bulkInsert(pool, 'addresses', addresses)
  return addresses
}
