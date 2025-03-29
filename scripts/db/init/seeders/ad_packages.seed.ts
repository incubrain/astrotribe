import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAdPackages(pool: Pool, count: number) {
  const packages = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 100, max: 10000 }),
    duration_days: faker.number.int({ min: 30, max: 365 }),
    impressions: faker.number.int({ min: 1000, max: 100000 }),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'ad_packages', packages)
  return packages
}
