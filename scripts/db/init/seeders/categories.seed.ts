import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedCategories(pool: Pool, count: number) {
  const categories = Array.from({ length: count }, () => ({
    id: generateUUID(),
    name: faker.word.noun(),
    description: faker.lorem.sentence(),
    slug: faker.helpers.slugify(faker.word.noun()).toLowerCase(),
    parent_id: null,
    is_active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'categories', categories)
  return categories
}
