import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // Get the next sequential id_old values from the sequence
  let nextIdOld = 1
  try {
    const { rows: maxId } = await pool.query(
      'SELECT COALESCE(MAX(id_old), 0) + 1 as next_id FROM addresses',
    )
    nextIdOld = parseInt(maxId[0].next_id, 10) || 1 // Default to 1 if NaN
    console.log(`Starting id_old value: ${nextIdOld}`)
  } catch (err) {
    console.warn('Could not get max id_old, starting from 1')
  }

  // Convert all array values to proper types
  const validCityIds = cityIds.map((id) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    return isNaN(numId) ? 1 : numId // Default to 1 if NaN
  })

  const validCountryIds = countryIds.map((id) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id
    return isNaN(numId) ? 1 : numId // Default to 1 if NaN
  })

  const numberOfAddresses = faker.number.int({ min: 10, max: 30 })
  const addresses = [] as {
    id: string
    id_old: number
    street1: string
    street2?: string
    city_id: number
    country_id: number
    name?: string
    is_primary: boolean
    address_type: string
    created_at: Date
    updated_at: Date
    user_id?: string
    company_id?: string
  }[]

  for (let i = 0; i < numberOfAddresses; i++) {
    // Only include user_id if userIds array is not empty
    const userIdField =
      userIds.length > 0
        ? {
            user_id: faker.helpers.maybe(() => faker.helpers.arrayElement(userIds), {
              probability: 0.3,
            }),
          }
        : {}

    // Only include company_id if companyIds array is not empty
    const companyIdField =
      companyIds.length > 0
        ? {
            company_id: faker.helpers.maybe(() => faker.helpers.arrayElement(companyIds), {
              probability: 0.3,
            }),
          }
        : {}

    // Ensure city_id and country_id are valid numbers
    const cityId = faker.helpers.arrayElement(validCityIds)
    const countryId = faker.helpers.arrayElement(validCountryIds)

    // Generate a sequential id_old for each address
    const idOld = nextIdOld + i

    addresses.push({
      id: generateUUID(),
      id_old: idOld, // Use a sequential integer ID for id_old
      street1: faker.location.streetAddress(),
      street2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
      city_id: cityId,
      country_id: countryId,
      name: faker.helpers.maybe(() => faker.company.name(), { probability: 0.5 }),
      is_primary: faker.datatype.boolean(),
      address_type: faker.helpers.arrayElement(validAddressTypes),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      ...userIdField,
      ...companyIdField,
    })
  }

  await bulkInsert(pool, 'addresses', addresses)
  return addresses
}
