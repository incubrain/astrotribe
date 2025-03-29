import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedSocialMedia(pool: Pool, companyIds: string[]) {
  const socialMedia = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
      id: generateUUID(),
      company_id: companyId,
      platform: faker.helpers.arrayElement([
        'twitter',
        'linkedin',
        'facebook',
        'instagram',
        'youtube',
        'github',
        'medium',
      ]),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      followers_count: faker.number.int({ min: 100, max: 1000000 }),
      is_verified: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'social_media', socialMedia)
  return socialMedia
}
