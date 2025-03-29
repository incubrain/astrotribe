import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import { ERROR_TYPES, SERVICE_NAMES, SEVERITIES } from '../utils/errors'

export async function seedErrorLogs(pool: Pool, count: number) {
  const logs = Array.from({ length: count }, () => ({
    id: generateUUID(),
    error_type: faker.helpers.arrayElement(ERROR_TYPES),
    service_name: faker.helpers.arrayElement(SERVICE_NAMES),
    severity: faker.helpers.arrayElement(SEVERITIES),
    message: faker.lorem.sentence(),
    stack_trace: faker.lorem.paragraph(),
    metadata: {
      user_id: faker.string.uuid(),
      request_id: faker.string.uuid(),
      timestamp: faker.date.recent().toISOString(),
    },
    created_at: faker.date.past(),
  }))

  await bulkInsert(pool, 'error_logs', logs)
  return logs
}
