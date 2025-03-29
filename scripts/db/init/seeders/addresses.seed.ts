import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { AddressType } from '../utils/types.js'

export async function seedAddresses(pool: Pool, companyIds: string[], cityIds: number[]) {
  const addresses = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      company_id: companyId,
      city_id: faker.helpers.arrayElement(cityIds),
      street_address: faker.location.streetAddress(),
      postal_code: faker.location.zipCode(),
      address_type: faker.helpers.arrayElement([
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
      is_primary: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'addresses', addresses)
  return addresses
}
