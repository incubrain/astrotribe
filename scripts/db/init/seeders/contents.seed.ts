import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID, generateUniqueUrl } from '../utils'

export async function seedContents(pool: Pool, count: number) {
  const usedUrls = new Set<string>()
  const contents: Array<{
    id: string
    url: string
    content_type: string
    title: string
    rss_url: string | null
    created_at: Date
    updated_at: Date
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

    // Generate RSS URL if needed, ensuring it's also unique
    let rssUrl: string | null = null
    if (Math.random() > 0.5) {
      rssUrl = `https://rss.${faker.internet.domainWord()}-${faker.number.int({ min: 1000, max: 9999 })}.${faker.internet.domainSuffix()}/feed`
      while (usedUrls.has(rssUrl)) {
        rssUrl = `https://rss.${faker.internet.domainWord()}-${faker.number.int({ min: 1000, max: 9999 })}.${faker.internet.domainSuffix()}/feed`
      }
      usedUrls.add(rssUrl)
    }

    const date = faker.date.recent()

    contents.push({
      id: generateUUID(),
      url,
      content_type: faker.helpers.arrayElement(['news', 'research', 'newsletters', 'jobs']),
      title: faker.company.name(),
      rss_url: rssUrl,
      created_at: date,
      updated_at: date,
    })
  }

  await bulkInsert(pool, 'contents', contents)
  return contents
}
