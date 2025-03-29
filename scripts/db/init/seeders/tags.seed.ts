import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedTags(pool: Pool, count: number) {
  const tags = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.word.noun(),
    slug: faker.helpers.slugify(faker.word.noun()).toLowerCase(),
    description: faker.lorem.sentence(),
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'tags', tags)
  return tags
}
