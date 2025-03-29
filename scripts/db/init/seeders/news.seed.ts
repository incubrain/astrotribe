import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types.js'

export async function seedNews(pool: Pool, contentIds: string[], companyIds: string[]) {
  const news = contentIds.map((contentId) => ({
    id: generateUUID(),
    content_id: contentId,
    company_id: faker.helpers.arrayElement(companyIds),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.person.fullName(),
    published_date: faker.date.past(),
    source_url: faker.internet.url(),
    source_name: faker.company.name(),
    status: faker.helpers.arrayElement([
      'draft',
      'pending_review',
      'published',
      'archived',
    ] as ContentStatus[]),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'news', news)
  return news
}
