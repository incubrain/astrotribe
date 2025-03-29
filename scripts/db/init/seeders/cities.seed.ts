import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedCities(pool: Pool): Promise<any> {
  const cities = [
    { id: 1, name: 'New York', country_id: 1, state: 'NY' },
    { id: 2, name: 'London', country_id: 2, state: null },
    { id: 3, name: 'Toronto', country_id: 3, state: 'ON' },
    { id: 4, name: 'Sydney', country_id: 4, state: 'NSW' },
    { id: 5, name: 'Berlin', country_id: 5, state: null },
    { id: 6, name: 'Paris', country_id: 6, state: null },
    { id: 7, name: 'Tokyo', country_id: 7, state: null },
    { id: 8, name: 'Beijing', country_id: 8, state: null },
    { id: 9, name: 'Mumbai', country_id: 9, state: 'Maharashtra' },
    { id: 10, name: 'São Paulo', country_id: 10, state: 'SP' },
  ]
  return await bulkInsert(pool, 'cities', cities)
}
