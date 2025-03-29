import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedAdPackages(pool: Pool, count: number) {
  const packages = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.commerce.productName(),
    position: faker.helpers.arrayElement(['header', 'sidebar', 'footer', 'content']),
    active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    description: faker.commerce.productDescription(),
    price: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
    features: faker.helpers.arrayElements(
      [
        'Premium placement',
        'Targeted audience',
        'Analytics dashboard',
        'Custom design',
        'Priority support',
        'Extended reach',
        'Mobile optimization',
        'A/B testing',
      ],
      { min: 3, max: 6 },
    ),
    expected_ctr: faker.number.float({ min: 0.1, max: 5.0, fractionDigits: 2 }),
    avg_roi: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
    view_frequency: faker.number.float({ min: 0.5, max: 2.0, fractionDigits: 2 }),
  }))

  await bulkInsert(pool, 'ad_packages', packages)
  return packages
}
