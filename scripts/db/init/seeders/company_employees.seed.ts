import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { AppRole } from '../utils/types.js'

export async function seedCompanyEmployees(pool: Pool, companyIds: string[], userIds: string[]) {
  const employees = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      company_id: companyId,
      user_id: faker.helpers.arrayElement(userIds),
      role: faker.helpers.arrayElement(['employee', 'manager', 'admin', 'founder'] as AppRole[]),
      start_date: faker.date.past(),
      end_date: faker.date.future(),
      is_active: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'company_employees', employees)
  return employees
}
