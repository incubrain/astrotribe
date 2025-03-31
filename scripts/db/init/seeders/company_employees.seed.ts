import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedCompanyEmployees(pool: Pool, companyIds: string[], userIds: string[]) {
  if (companyIds.length === 0 || userIds.length === 0) {
    console.warn('No companies or users available for creating company employees')
    return []
  }

  console.log(
    `Generating company employees for ${companyIds.length} companies with ${userIds.length} users`,
  )

  try {
    const accessLevels = ['read', 'write', 'admin', 'owner']

    const employees = companyIds.flatMap((companyId) =>
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        id: generateUUID(),
        company_id: companyId,
        user_id: faker.helpers.arrayElement(userIds),
        role: faker.helpers.arrayElement(['employee', 'manager', 'admin', 'founder']),
        job_description: faker.person.jobDescriptor() + ' ' + faker.person.jobType(),
        start_date: new Date(faker.date.past()),
        end_date: faker.helpers.maybe(() => new Date(faker.date.future()), { probability: 0.3 }),
        status: faker.datatype.boolean(),
        access_level: faker.helpers.arrayElement(accessLevels),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })),
    )

    console.log(`Generated ${employees.length} company employees`)

    // Log a sample employee for debugging
    if (employees.length > 0) {
      console.log('Sample company employee:', JSON.stringify(employees[0], null, 2))
    }

    await bulkInsert(pool, 'company_employees', employees)
    return employees
  } catch (error: any) {
    console.error('Error in seedCompanyEmployees:', error)
    throw error
  }
}
