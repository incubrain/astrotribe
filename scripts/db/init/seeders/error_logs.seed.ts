import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import { ERROR_TYPES, SERVICE_NAMES, SEVERITIES } from '../utils/errors'

export async function seedErrorLogs(pool: Pool, count: number) {
  const environments = ['development', 'staging', 'production', 'test']

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
    context: {}, // Empty object for context
    user_id: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.5 }),
    request_id: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.7 }),
    correlation_id: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.3 }),
    // Add environment field which is required (NOT NULL)
    environment: faker.helpers.arrayElement(environments),
    created_at: faker.date.past(),
    // Add additional fields from schema
    error_hash: faker.helpers.maybe(() => faker.git.commitSha(), { probability: 0.8 }),
    error_pattern: faker.helpers.maybe(() => faker.system.fileExt(), { probability: 0.6 }),
    is_new_pattern: faker.helpers.maybe(() => faker.datatype.boolean(), { probability: 0.3 }),
    github_repo: faker.helpers.maybe(() => faker.internet.domainWord(), { probability: 0.2 }),
    related_errors: faker.helpers.maybe(() => ({ count: faker.number.int({ min: 1, max: 10 }) }), {
      probability: 0.4,
    }),
    frequency_data: faker.helpers.maybe(
      () => ({
        last_24h: faker.number.int({ min: 0, max: 100 }),
        last_week: faker.number.int({ min: 0, max: 500 }),
      }),
      { probability: 0.4 },
    ),
    domain: faker.helpers.maybe(() => faker.internet.domainName(), { probability: 0.5 }),
  }))

  await bulkInsert(pool, 'error_logs', logs)
  return logs
}
