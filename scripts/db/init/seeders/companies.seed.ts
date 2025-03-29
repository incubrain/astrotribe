import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedCompanies(pool: Pool, count: number) {
  const companies = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    website: faker.internet.url(),
    founded_year: faker.number.int({ min: 1900, max: 2023 }),
    industry: faker.company.buzzNoun(),
    size_range: faker.helpers.arrayElement([
      '1-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1001-5000',
      '5001-10000',
      '10001+',
    ]),
    funding_stage: faker.helpers.arrayElement([
      'seed',
      'angel',
      'series_a',
      'series_b',
      'series_c',
      'series_d',
      'series_e',
      'public',
    ]),
    total_funding: faker.number.int({ min: 100000, max: 1000000000 }),
    is_public: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'companies', companies)
  return companies
}
