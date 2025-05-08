import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert } from '../utils'

export async function seedSocialMedia(pool: Pool, count: number = 100) {
  // Create social media entries with sequential IDs to ensure we have the specific IDs
  // that the companies seeder is trying to reference
  const socialMedia = Array.from({ length: count }, (_, index) => ({
    id: index + 1, // Use sequential IDs starting from 1
    facebook_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
    twitter_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
    linkedin_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.7 }),
    instagram_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.6 }),
    youtube_url: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.5 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'social_media', socialMedia)
  return socialMedia
}
