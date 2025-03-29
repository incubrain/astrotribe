import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'
import type { ContentStatus } from '../utils/types.js'

export async function seedResearch(pool: Pool, contentIds: string[], companyIds: string[]) {
  const research = contentIds.map((contentId) => ({
    id: generateUUID(),
    content_id: contentId,
    company_id: faker.helpers.arrayElement(companyIds),
    title: faker.lorem.sentence(),
    abstract: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(5),
    authors: faker.helpers.multiple(() => faker.person.fullName(), { count: 3 }),
    published_date: faker.date.past(),
    doi: faker.helpers.replaceSymbols('10.????/????-????-????-????'),
    citation_count: faker.number.int({ min: 0, max: 1000 }),
    status: faker.helpers.arrayElement([
      'draft',
      'pending_review',
      'published',
      'archived',
    ] as ContentStatus[]),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'research', research)
  return research
}
