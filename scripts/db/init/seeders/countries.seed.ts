import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedCountries(pool: Pool): Promise<any> {
  const countries = [
    { id: 1, name: 'United States', code: 'US', code_3: 'USA' },
    { id: 2, name: 'United Kingdom', code: 'GB', code_3: 'GBR' },
    { id: 3, name: 'Canada', code: 'CA', code_3: 'CAN' },
    { id: 4, name: 'Australia', code: 'AU', code_3: 'AUS' },
    { id: 5, name: 'Germany', code: 'DE', code_3: 'DEU' },
    { id: 6, name: 'France', code: 'FR', code_3: 'FRA' },
    { id: 7, name: 'Japan', code: 'JP', code_3: 'JPN' },
    { id: 8, name: 'China', code: 'CN', code_3: 'CHN' },
    { id: 9, name: 'India', code: 'IN', code_3: 'IND' },
    { id: 10, name: 'Brazil', code: 'BR', code_3: 'BRA' },
  ]
  return await bulkInsert(pool, 'countries', countries)
}
