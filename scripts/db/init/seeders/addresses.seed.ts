import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'
import type { AddressType } from '../utils/types.js'

export async function seedAddresses(
  pool: Pool,
  cityIds: number[],
  countryIds: number[],
  companyIds: string[],
  userIds: string[],
) {
  const addresses = Array.from({ length: faker.number.int({ min: 10, max: 50 }) }, () => ({
    street1: faker.location.streetAddress(),
    street2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
    city_id: faker.helpers.arrayElement(cityIds),
    country_id: faker.helpers.arrayElement(countryIds),
    name: faker.helpers.maybe(() => faker.company.name(), { probability: 0.5 }),
    user_id: faker.helpers.maybe(() => faker.helpers.arrayElement(userIds), { probability: 0.3 }),
    is_primary: faker.datatype.boolean(),
    address_type: faker.helpers.arrayElement([
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
    ] as AddressType[]),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    company_id: faker.helpers.maybe(() => faker.helpers.arrayElement(companyIds), {
      probability: 0.3,
    }),
  }))

  await bulkInsert(pool, 'addresses', addresses)
  return addresses
}
