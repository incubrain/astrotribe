import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedUserProfiles(pool: Pool, count: number = 3) {
  const users = Array.from({ length: count }, () => ({
    id: generateUUID(),
    email: faker.internet.email(),
    full_name: faker.person.fullName(),
    avatar_url: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'user_profiles', users)
  return users
}
