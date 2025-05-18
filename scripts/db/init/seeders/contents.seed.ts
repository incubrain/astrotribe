import { faker } from '@faker-js/faker'
import chalk from 'chalk'
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
    company_id?: string
    deleted_at?: Date
    description?: string
    hash?: string
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
        'opportunities',
        'companies',
        'contact',
        'people',
        'unknown',
      ]),
      title,
      created_at: date,
      updated_at: date,
      description: faker.lorem.paragraph(),
      published_at: faker.date.recent(),
      hot_score: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
    })
  }

  await bulkInsert(pool, 'contents', contents)
  return contents
}

export async function seedNewsContent(pool: Pool, count: number) {
  const { rows: contentSources } = await pool.query('SELECT id FROM content_sources')

  // Extract just the IDs into an array
  const sourceIds = contentSources.map((source) => source.id)

  const usedUrls = new Set<string>()
  const contents: Array<{
    id: string
    url: string
    uri: string
    content_type: string
    title: string
    created_at: Date
    updated_at: Date
    description?: string
    published_at?: Date
    hot_score?: number
    source_id?: string
  }> = []

  // Keep generating until we have the desired count
  while (contents.length < count) {
    // Generate a unique URL for news articles
    let url = `https://news-${faker.internet.domainWord()}.${faker.internet.domainSuffix()}/article/${faker.string.uuid()}`

    // Ensure URL is unique
    while (usedUrls.has(url)) {
      url = `https://news-${faker.internet.domainWord()}.${faker.internet.domainSuffix()}/article/${faker.string.uuid()}`
    }

    usedUrls.add(url)

    const date = faker.date.recent()
    const publishedDate = faker.date.recent()

    // Select a random existing source ID instead of generating one
    const source_id = faker.helpers.arrayElement(sourceIds)

    // Create more realistic news titles
    const newsTitle = faker.helpers.arrayElement([
      `SpaceX ${faker.company.buzzVerb()} ${faker.company.buzzNoun()} for Mars Mission`,
      `NASA ${faker.science.chemicalElement().name} Experiment Shows Promising Results`,
      `New ${faker.science.chemicalElement().name} Discovery Could Transform Space Travel`,
      `${faker.location.country()} Launches New Space Program`,
      `Astronomers Discover ${faker.number.int({ min: 2, max: 10 })} New Exoplanets in ${faker.word.noun()} System`,
      `New Research: ${faker.science.unit().name} Measurements Change Our Understanding of Black Holes`,
      `${faker.company.name()} Secures $${faker.number.int({ min: 10, max: 500 })}M Funding for Space Tech`,
      `Breaking: ${faker.person.lastName()} Named New Head of ${faker.helpers.arrayElement(['NASA', 'ESA', 'ISRO', 'JAXA'])}`,
    ])

    contents.push({
      id: generateUUID(),
      url,
      uri: url,
      content_type: 'news',
      title: newsTitle,
      created_at: date,
      updated_at: date,
      description: faker.lorem.paragraphs(2),
      published_at: publishedDate,
      hot_score: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
      source_id,
    })
  }

  // Use your existing bulkInsert function
  await bulkInsert(pool, 'contents', contents)
  return contents
}
