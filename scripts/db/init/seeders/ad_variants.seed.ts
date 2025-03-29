import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from './helpers'

export async function seedAdVariants(pool: Pool, adIds: string[]) {
  const variants = adIds.flatMap((adId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUUID(),
      ad_id: adId,
      content: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image_url: faker.image.url(),
        cta_text: faker.helpers.arrayElement([
          'Learn More',
          'Sign Up',
          'Get Started',
          'Contact Us',
        ]),
        cta_url: faker.internet.url(),
      },
      is_control: faker.datatype.boolean(),
      active: faker.datatype.boolean(),
      performance_metrics: {
        ctr: faker.number.float({ min: 0, max: 1 }),
        conversion_rate: faker.number.float({ min: 0, max: 1 }),
        cost_per_click: faker.number.float({ min: 0, max: 10 }),
      },
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'ad_variants', variants)
  return variants
}
