import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBookmarks(
  pool: Pool,
  userIds: string[],
  contentIds: string[],
  folderIds: string[],
) {
  const bookmarks = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      content_id: faker.helpers.arrayElement(contentIds),
      folder_id: faker.helpers.arrayElement(folderIds),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      is_favorite: faker.datatype.boolean(),
      position: faker.number.int({ min: 0, max: 100 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'bookmarks', bookmarks)
  return bookmarks
}
