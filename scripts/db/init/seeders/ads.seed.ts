import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAds(pool: Pool, companyIds: string[], packageIds: string[]) {
  const ads = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      company_id: companyId,
      package_id: faker.helpers.arrayElement(packageIds),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      start_date: faker.date.past(),
      end_date: faker.date.future(),
      status: faker.helpers.arrayElement(['active', 'paused', 'completed', 'cancelled']),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'ads', ads)
  return ads
}
