import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedReferrals(pool: Pool, visitorIds: string[]) {
  const referrals = visitorIds.map((visitorId) => ({
    id: generateUUID(),
    referrer_code: faker.string.alphanumeric(8).toUpperCase(),
    visitor_id: visitorId,
    created_at: faker.date.past(),
    converted_at: faker.date.future(),
    referral_status: faker.helpers.arrayElement(['pending', 'converted', 'expired', 'invalid']),
    conversion_value: faker.number.float({ min: 0, max: 1000 }),
    user_agent: faker.internet.userAgent(),
    ip_address: faker.internet.ip(),
    landing_page: faker.internet.url(),
    utm_source: faker.helpers.arrayElement(['google', 'facebook', 'twitter', 'linkedin']),
    utm_medium: faker.helpers.arrayElement(['cpc', 'social', 'email', 'banner']),
    utm_campaign: faker.helpers.arrayElement(['summer_sale', 'new_product', 'brand_awareness']),
    device_type: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
    browser: faker.helpers.arrayElement(['chrome', 'firefox', 'safari', 'edge']),
    country_code: faker.location.countryCode(),
    region: faker.location.state(),
    is_suspicious: faker.datatype.boolean(),
    security_flags: {
      vpn_detected: faker.datatype.boolean(),
      proxy_detected: faker.datatype.boolean(),
      multiple_ips: faker.datatype.boolean(),
    },
    validation_attempts: faker.number.int({ min: 0, max: 3 }),
    last_failed_attempt: faker.date.past(),
    client_fingerprint: faker.string.uuid(),
  }))

  await bulkInsert(pool, 'referrals', referrals)
  return referrals
}
