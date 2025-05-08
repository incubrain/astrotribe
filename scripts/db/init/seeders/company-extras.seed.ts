import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedCompanyExtras(pool: Pool, companyIds: string[], count: number = 100) {
  if (companyIds.length === 0) {
    console.warn('No companies available to seed company_extras')
    return []
  }

  console.log(`Generating ${count} company extras for ${companyIds.length} companies`)

  try {
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
        updated_at: new Date(faker.date.recent()),
        created_at: new Date(faker.date.past()),
        url: `https://${faker.internet.domainName()}/${category}`,
        success: faker.datatype.boolean(),
        category: category,
        level: level,
        company_id: company,
        // Note: The schema has multiple company_id columns which is problematic.
        // We're only setting one company_id field as the database should handle this correctly.
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

    console.log(`Generated ${companyExtras.length} company extras`)

    // Log a sample company extra for debugging
    if (companyExtras.length > 0) {
      console.log('Sample company extra:', JSON.stringify(companyExtras[0], null, 2))
    }

    await bulkInsert(pool, 'company_extras', companyExtras)
    return companyExtras
  } catch (error: any) {
    console.error('Error in seedCompanyExtras:', error)
    throw error
  }
}
