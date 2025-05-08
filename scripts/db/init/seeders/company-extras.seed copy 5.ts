import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedCompanyExtras(pool: Pool, companyIds: string[], count: number = 100) {
  if (companyIds.length === 0) {
    console.warn('No companies available to seed company_extras')
    return []
  }

  const extraCategories = [
    'about',
    'team',
    'careers',
    'values',
    'history',
    'mission',
    'press',
    'leadership',
    'customers',
    'partnership',
    'sustainability',
  ]

  const companyExtras = Array.from({ length: count }, (_, index) => {
    const company = faker.helpers.arrayElement(companyIds)
    const category = faker.helpers.arrayElement(extraCategories)
    const level = faker.number.int({ min: 1, max: 5 })

    return {
      id: index + 1, // Using index for id as schema uses integer
      updated_at: faker.date.recent(),
      created_at: faker.date.past(),
      url: `https://${faker.internet.domainName()}/${category}`,
      success: faker.datatype.boolean(),
      category: category,
      level: level,
      company_id: company,
      body: faker.lorem.paragraphs(),
      found_count: faker.number.int({ min: 0, max: 20 }),
      review: {
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        reviewed_at: faker.date.recent(),
        reviewed_by: faker.person.fullName(),
        notes: faker.lorem.sentence(),
      },
    }
  })

  await bulkInsert(pool, 'company_extras', companyExtras)
  return companyExtras
}
