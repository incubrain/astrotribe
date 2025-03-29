import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedComments(pool: Pool, userIds: string[], contentIds: string[]) {
  const comments = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      user_id: faker.helpers.arrayElement(userIds),
      content_id: contentId,
      parent_id: null,
      content: faker.lorem.paragraph(),
      is_edited: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'comments', comments)
  return comments
}
