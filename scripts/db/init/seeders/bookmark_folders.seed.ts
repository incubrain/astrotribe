import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedBookmarkFolders(pool: Pool, userIds: string[]) {
  const folders = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      name: faker.word.noun(),
      color: faker.color.rgb(),
      is_default: false,
      is_favorite: faker.datatype.boolean(),
      position: faker.number.int({ min: 0, max: 100 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'bookmark_folders', folders)
  return folders
}
