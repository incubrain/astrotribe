import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { AddressType } from '../utils/types.js'

export async function seedAddresses(
  pool: Pool,
  cityIds: number[] = [],
  countryIds: number[] = [],
  companyIds: string[] = [],
  userIds: string[] = [],
) {
  // Handle empty datasets by fetching from database or creating fallback values
  if (cityIds.length === 0) {
    try {
      // Try to get city IDs from database
      const { rows: cityRows } = await pool.query('SELECT id FROM cities LIMIT 100')
      if (cityRows.length > 0) {
        cityIds = cityRows.map((row) => Number(row.id))
      } else {
        // Create fallback city IDs
        cityIds = Array.from({ length: 10 }, (_, i) => i + 1)
        console.log('No cities found. Using fallback city IDs:', cityIds)
      }
    } catch (error) {
      console.error('Error fetching city IDs:', error)
      // Create fallback city IDs
      cityIds = Array.from({ length: 10 }, (_, i) => i + 1)
      console.log('Error fetching cities. Using fallback city IDs:', cityIds)
    }
  }

  if (countryIds.length === 0) {
    try {
      // Try to get country IDs from database
      const { rows: countryRows } = await pool.query('SELECT id FROM countries LIMIT 100')
      if (countryRows.length > 0) {
        countryIds = countryRows.map((row) => Number(row.id))
      } else {
        // Create fallback country IDs
        countryIds = Array.from({ length: 10 }, (_, i) => i + 1)
        console.log('No countries found. Using fallback country IDs:', countryIds)
      }
    } catch (error) {
      console.error('Error fetching country IDs:', error)
      // Create fallback country IDs
      countryIds = Array.from({ length: 10 }, (_, i) => i + 1)
      console.log('Error fetching countries. Using fallback country IDs:', countryIds)
    }
  }

  // Only proceed if we have cities and countries
  if (cityIds.length === 0 || countryIds.length === 0) {
    console.warn('Could not create addresses: missing city or country IDs')
    return []
  }

  const addresses = Array.from({ length: faker.number.int({ min: 10, max: 50 }) }, () => {
    // Only include user_id if userIds array is not empty
    const userIdField = userIds.length > 0 ?
      { user_id: faker.helpers.maybe(() => faker.helpers.arrayElement(userIds), { probability: 0.3 }) } :
      {}

    // Only include company_id if companyIds array is not empty
    const companyIdField = companyIds.length > 0 ?
      { company_id: faker.helpers.maybe(() => faker.helpers.arrayElement(companyIds), { probability: 0.3 }) } :
      {}

    // Ensure city_id and country_id are numbers
    const cityId = faker.helpers.arrayElement(cityIds)
    const countryId = faker.helpers.arrayElement(countryIds)

    return {
      id: generateUUID(),
      street1: faker.location.streetAddress(),
      street2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
      city_id: typeof cityId === 'string' ? parseInt(cityId, 10) : cityId,
      country_id: typeof countryId === 'string' ? parseInt(countryId, 10) : countryId,
      name: faker.helpers.maybe(() => faker.company.name(), { probability: 0.5 }),
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
      ...userIdField,
      ...companyIdField,
    }
  })

  await bulkInsert(pool, 'addresses', addresses)
  return addresses
}
