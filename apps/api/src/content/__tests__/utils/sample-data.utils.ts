import type { Prisma } from '@astronera/db'
import { ContentType, ContentStatus, Priority } from '@astronera/db'
import { faker } from '@faker-js/faker'

export const createSampleCategory = (): Prisma.CategoriesCreateInput => ({
  id: faker.number.int(),
  name: faker.commerce.department(),
})

export const createSampleContentCategory = (): Prisma.ContentCategoriesCreateInput => ({
  is_primary: faker.datatype.boolean(),
  contents: { connect: { id: faker.string.uuid() } },
  categories: { connect: { id: faker.number.int() } },
})

export const createSampleContentSource = (): Prisma.ContentSourcesCreateInput => ({
  url: faker.internet.url(),
  content_type: faker.helpers.arrayElement([...Object.values(ContentType)]),
  scrape_frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly']),
  refreshed_at: faker.date.recent(),
  has_failed: faker.datatype.boolean(),
  failed_count: faker.number.int({ min: 0, max: 10 }),
  priority: faker.helpers.arrayElement([...Object.values(Priority)]),
  hash: faker.number.int(),
  scraped_at: faker.date.recent(),
  expected_count: faker.number.int({ min: 1, max: 100 }),
  rss_urls: [faker.internet.url(), faker.internet.url()],
})

export const createSampleContentSourceVisit = (): Prisma.ContentSourceVisitsCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  user_profiles: { connect: { id: faker.string.uuid() } },
})

export const createSampleContentStatus = (): Prisma.ContentStatusesCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  notes: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  content_status: faker.helpers.arrayElement([...Object.values(ContentStatus)]),
})

export const createSampleContentTag = (): Prisma.ContentTagsCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  tags: { connect: { id: faker.number.int() } },
})

export const createSampleContent = (): Prisma.ContentsCreateInput => ({
  content_type: faker.helpers.arrayElement([...Object.values(ContentType)]),
  title: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  url: faker.internet.url(),
  rss_url: faker.helpers.arrayElement([faker.internet.url(), null]),
  hot_score: faker.helpers.arrayElement([faker.number.int({ min: 0, max: 100 }), null]),
})
