import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types.js'

export async function seedNewsletters(pool: Pool, contentIds: string[], companyIds: string[]) {
  const newsletters = contentIds.map((contentId) => ({
    id: generateUUID(),
    content_id: contentId,
    company_id: faker.helpers.arrayElement(companyIds),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    published_date: faker.date.past(),
    issue_number: faker.number.int({ min: 1, max: 100 }),
    subscriber_count: faker.number.int({ min: 100, max: 100000 }),
    status: faker.helpers.arrayElement([
      'draft',
      'scheduled',
      'published',
      'archived',
    ] as ContentStatus[]),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'newsletters', newsletters)
  return newsletters
}
