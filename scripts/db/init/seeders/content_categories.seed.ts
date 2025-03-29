import type { Pool } from 'pg'
import { faker } from '@faker-js/faker'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContentCategories(
  pool: Pool,
  contentIds: string[],
  categoryIds: string[],
) {
  const contentCategories = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      content_id: contentId,
      category_id: faker.helpers.arrayElement(categoryIds),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'content_categories', contentCategories)
  return contentCategories
}
