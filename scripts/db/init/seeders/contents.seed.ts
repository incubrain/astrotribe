import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from '../utils'

export async function seedContents(pool: Pool, count: number) {
  const usedUrls = new Set<string>()
  const contents: Array<{
    id: string
    url: string
    content_type: string
    title: string
    created_at: Date
    updated_at: Date
    author?: string
    company_id?: string
    content_signature?: string
    deleted_at?: Date
    description?: string
    details?: any
    featured_image?: string
    hash?: string
    is_active?: boolean
    published_at?: Date
    source_id?: string
    hot_score?: number
  }> = []

  // Keep generating until we have the desired count
  while (contents.length < count) {
    // Generate a unique URL using random components
    let url = `https://${faker.internet.domainWord()}-${faker.internet.domainWord()}-${faker.number.int({ min: 1000, max: 9999 })}.${faker.internet.domainSuffix()}/`

    // If by chance we still get a duplicate, keep trying
    while (usedUrls.has(url)) {
      url = `https://${faker.internet.domainWord()}-${faker.internet.domainWord()}-${faker.number.int({ min: 1000, max: 9999 })}.${faker.internet.domainSuffix()}/`
    }

    usedUrls.add(url)

    const date = faker.date.recent()
    const title = faker.company.name()

    contents.push({
      id: generateUUID(),
      url,
      content_type: faker.helpers.arrayElement([
        'news',
        'research',
        'newsletters',
        'jobs',
        'companies',
        'contact',
        'people',
        'unknown',
      ]),
      title,
      created_at: date,
      updated_at: date,
      author: faker.person.fullName(),
      description: faker.lorem.paragraph(),
      featured_image: faker.image.url(),
      is_active: true,
      published_at: faker.date.recent(),
      content_signature: title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 50),
      details: {
        tags: faker.helpers.arrayElements(['technology', 'science', 'business', 'health'], {
          min: 1,
          max: 3,
        }),
        reading_time: faker.number.int({ min: 2, max: 15 }),
        language: 'en',
      },
      hot_score: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
    })
  }

  await bulkInsert(pool, 'contents', contents)
  return contents
}
