import type { Pool } from 'pg'
import { faker } from '@faker-js/faker'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContentTags(pool: Pool, contentIds: string[], tagIds: string[]) {
  const contentTags = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      content_id: contentId,
      tag_id: faker.helpers.arrayElement(tagIds),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'content_tags', contentTags)
  return contentTags
}
