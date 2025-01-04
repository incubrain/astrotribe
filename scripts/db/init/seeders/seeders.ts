import { createHash } from 'crypto'
import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import {
  bulkInsert,
  generateUUID,
  generateUniqueId,
  generateUniqueUrl,
  generateUniqueValue,
} from './seed-helpers'
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  SERVICE_NAMES,
  SEVERITIES,
  COMMON_ERRORS,
  generateStackTrace,
} from './errors'

// Add to your seed-helpers.ts or create a new helpers file
const formatTimeWithZone = (date: Date) => {
  return (
    date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    }) + '+00'
  )
}

export async function createContentStatuses(
  pool: Pool,
  contents: Array<{ id: string; content_status: string }>,
  entityType: string, // e.g., 'news', 'research', 'company'
) {
  const statuses = contents.map((content) => ({
    id: generateUUID(),
    content_id: content.id,
    content_status: content.content_status,
    notes: `Initial ${entityType} status`,
    created_at: new Date(),
  }))

  await bulkInsert(pool, 'content_statuses', statuses)
  return statuses
}

// Helper to ensure we use consistent status transitions
export const getContentStatusFlow = (entityType: string) => {
  const commonStatuses = [
    'draft',
    'pending_agent_review',
    'pending_human_review',
    'published',
    'archived',
  ] as const

  // Add entity-specific statuses
  switch (entityType) {
    case 'news':
      return [...commonStatuses, 'pending_relevance_check', 'scraped', 'outdated', 'updated']
    case 'research':
      return [...commonStatuses, 'pending_crawl', 'irrelevant']
    default:
      return commonStatuses
  }
}

// Define TypeScript types from the enums
type AccessLevel = 'viewer' | 'editor' | 'admin' | 'super_admin'
type AddressType =
  | 'residential'
  | 'headquarters'
  | 'office'
  | 'factory'
  | 'lab'
  | 'warehouse'
  | 'research'
  | 'retail'
  | 'showroom'
  | 'branch'
type AppPlan = 'free' | 'basic' | 'intermediate' | 'premium' | 'enterprise' | 'custom'
type AppRole =
  | 'guest'
  | 'user'
  | 'astroguide'
  | 'mentor'
  | 'moderator'
  | 'tenant_member'
  | 'tenant_admin'
  | 'tenant_super_admin'
  | 'admin'
  | 'super_admin'
  | 'service_role'
type ContactType = 'personal' | 'company' | 'professional' | 'recruitment' | 'founder'
type ContentStatus =
  | 'draft'
  | 'pending_agent_action'
  | 'pending_agent_review'
  | 'pending_human_review'
  | 'pending_relevance_check'
  | 'irrelevant'
  | 'scheduled'
  | 'unpublished'
  | 'archived'
  | 'published'
  | 'failed'
  | 'pending_crawl'
  | 'scraped'
  | 'outdated'
  | 'updated'
  | 'new'
type ContentType =
  | 'news'
  | 'events'
  | 'jobs'
  | 'research'
  | 'companies'
  | 'contact'
  | 'people'
  | 'unknown'
type FeedbackStatus =
  | 'new'
  | 'under_review'
  | 'backlog'
  | 'working_on'
  | 'resolved'
  | 'rejected'
  | 'deferred'
type FeedbackType =
  | 'bug_report'
  | 'feature_request'
  | 'user_interface_issue'
  | 'performance_issue'
  | 'documentation'
type FollowedEntity = 'company' | 'user'
type Priority = 'very_low' | 'low' | 'medium' | 'high' | 'critical'
type PrivacyLevel = 'private' | 'connected' | 'public'
type ScrapeFrequency =
  | 'four_times_daily'
  | 'twice_daily'
  | 'daily'
  | 'twice_weekly'
  | 'weekly'
  | 'bi_weekly'
  | 'monthly'
  | 'quarterly'
  | 'biannual'
  | 'annually'
  | 'never'

// Helper functions for enum values
const randomEnum = <T extends string>(values: readonly T[]): T => {
  return faker.helpers.arrayElement(values as T[])
}

// Base seeders for reference tables
export async function seedCountries(pool: Pool): Promise<any> {
  const countries = [
    { id: 1, name: 'United States', code: 'US', code_3: 'USA' },
    { id: 2, name: 'United Kingdom', code: 'GB', code_3: 'GBR' },
    // Add more countries as needed
  ]
  return await bulkInsert(pool, 'countries', countries)
}

export async function seedCities(pool: Pool): Promise<any> {
  const cities = [
    { id: 1, name: 'New York', country_id: 1, state: 'NY' },
    { id: 2, name: 'London', country_id: 2, state: null },
    // Add more cities as needed
  ]
  const data = await bulkInsert(pool, 'cities', cities)

  return data
}

// Content-related seeders
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
      content_type: faker.helpers.arrayElement(['news', 'research', 'newsletters']),
      title: faker.company.name(),
      rss_url: rssUrl,
      created_at: date,
      updated_at: date,
    })
  }

  await bulkInsert(pool, 'contents', contents)
  return contents
}

export async function seedBookmarkFolders(pool: Pool, userIds: string[]) {
  const folders = userIds.flatMap((userId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      id: generateUUID(),
      user_id: userId,
      name: faker.word.noun(),
      color: faker.color.rgb(),
      is_default: false,
      is_favorite: faker.datatype.boolean(),
      position: faker.number.int({ min: 0, max: 100 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'bookmark_folders', folders)
  return folders
}

export async function seedBookmarks(pool: Pool, folders: any[], contents: any[]): Promise<any> {
  const bookmarks = [] as any[]
  const userContentMap = new Map() // Track user's bookmarked content

  // Sort folders by user_id to group them
  const foldersByUser = folders.reduce((acc, folder) => {
    if (!acc[folder.user_id]) {
      acc[folder.user_id] = []
    }
    acc[folder.user_id].push(folder)
    return acc
  }, {})

  // For each user
  Object.entries(foldersByUser).forEach(([userId, userFolders]) => {
    // Get a subset of contents for this user
    const userContentCount = faker.number.int({ min: 5, max: 20 })
    const userContents = faker.helpers.arrayElements(contents, userContentCount)

    // Distribute these contents across user's folders
    userContents.forEach((content) => {
      // Get random folder from user's folders
      const randomFolder = faker.helpers.arrayElement(userFolders as any[])

      // Create unique key for user-content combination
      const key = `${userId}-${content.content_type}-${content.id}`

      // Only create bookmark if this combination doesn't exist
      if (!userContentMap.has(key)) {
        userContentMap.set(key, true)
        bookmarks.push({
          id: generateUUID(),
          user_id: userId,
          folder_id: randomFolder.id,
          content_id: content.id,
          content_type: content.content_type,
          metadata: { notes: faker.lorem.sentence() },
          created_at: faker.date.past(),
          updated_at: faker.date.recent(),
        })
      }
    })
  })

  if (bookmarks.length > 0) {
    await bulkInsert(pool, 'bookmarks', bookmarks)
  }
  return bookmarks
}

export async function seedComments(
  pool: Pool,
  contentIds: string[],
  userIds: string[],
): Promise<any> {
  const comments = contentIds.flatMap((contentId) =>
    Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      id: generateUUID(),
      content: faker.lorem.paragraph(),
      user_id: faker.helpers.arrayElement(userIds),
      content_id: contentId,
      content_type: faker.helpers.arrayElement(['news', 'research']),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'comments', comments)
}

export async function seedVotes(pool: Pool, contentIds: string[], userIds: string[]) {
  // Create a Set to track unique combinations
  const usedCombinations = new Set<string>()
  const votes: Array<{
    id: string
    content_id: string
    user_id: string
    content_type: string
    vote_type: number
    created_at: Date
  }> = []

  // For each content, add some random votes
  for (const contentId of contentIds) {
    // Randomly select how many users will vote on this content
    const numberOfVoters = faker.number.int({ min: 0, max: Math.min(5, userIds.length) })

    // Randomly select users to vote
    const shuffledUsers = faker.helpers.shuffle([...userIds]).slice(0, numberOfVoters)

    for (const userId of shuffledUsers) {
      const contentType = faker.helpers.arrayElement(['news', 'research'])

      // Create a unique key for this combination
      const combinationKey = `${contentType}-${contentId}-${userId}`

      // Only add if this combination hasn't been used
      if (!usedCombinations.has(combinationKey)) {
        usedCombinations.add(combinationKey)

        votes.push({
          id: generateUUID(),
          content_id: contentId,
          user_id: userId,
          content_type: contentType,
          vote_type: faker.helpers.arrayElement([1, -1]), // 1 for upvote, -1 for downvote
          created_at: faker.date.past(),
        })
      }
    }
  }

  if (votes.length > 0) {
    await bulkInsert(pool, 'votes', votes)
  }
  return votes
}

// Updated seeders with correct enum values
export async function seedContentSources(pool: Pool, companyIds: string[]) {
  const contentTypes: ContentType[] = [
    'news',
    'events',
    'jobs',
    'research',
    'contact',
    'people',
    'unknown',
  ]
  const frequencies: ScrapeFrequency[] = [
    'four_times_daily',
    'twice_daily',
    'daily',
    'twice_weekly',
    'weekly',
    'bi_weekly',
    'monthly',
    'quarterly',
    'biannual',
    'annually',
  ]
  const priorities: Priority[] = ['very_low', 'low', 'medium', 'high', 'critical']

  const sources = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      company_id: companyId,
      url: faker.internet.url(),
      rss_urls: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        faker.internet.url(),
      ),
      content_type: randomEnum(contentTypes),
      scrape_frequency: randomEnum(frequencies),
      priority: randomEnum(priorities),
      expected_count: faker.number.int({ min: 5, max: 20 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  return await bulkInsert(pool, 'content_sources', sources)
}

export async function seedCompanyEmployees(
  pool: Pool,
  companyIds: string[],
  userIds: string[],
): Promise<any> {
  const accessLevels: AccessLevel[] = ['viewer', 'editor', 'admin', 'super_admin']

  const employees = companyIds.flatMap((companyId) =>
    Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      company_id: companyId,
      user_id: faker.helpers.arrayElement(userIds),
      role: faker.person.jobTitle(),
      job_description: faker.lorem.paragraph(),
      access_level: randomEnum(accessLevels),
      status: true,
      start_date: faker.date.past(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'company_employees', employees)
}

export async function seedContacts(pool: Pool, companyIds: string[], userIds: string[]) {
  const contactTypes: ContactType[] = [
    'personal',
    'company',
    'professional',
    'recruitment',
    'founder',
  ]
  const privacyLevels: PrivacyLevel[] = ['private', 'connected', 'public']

  // Track used IDs
  const usedIds = new Set<number>()

  const contacts = [...Array(faker.number.int({ min: 50, max: 100 }))].map(() => ({
    id: generateUniqueId(1, 99999, usedIds),
    company_id: faker.helpers.arrayElement(companyIds),
    user_id: faker.helpers.arrayElement(userIds),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    title: faker.person.jobTitle(),
    is_primary: faker.datatype.boolean(),
    contact_type: randomEnum(contactTypes),
    privacy_level: randomEnum(privacyLevels),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'contacts', contacts)
  return contacts
}

export async function seedAddresses(
  pool: Pool,
  cityIds: number[],
  countryIds: number[],
  userIds: string[],
  companyIds: string[],
): Promise<any> {
  const addressTypes: AddressType[] = [
    'residential',
    'headquarters',
    'office',
    'factory',
    'lab',
    'warehouse',
    'research',
    'retail',
    'showroom',
    'branch',
  ]

  const addresses = [...Array(faker.number.int({ min: 50, max: 100 }))].map(() => {
    const isUserAddress = Math.random() > 0.5
    return {
      id: faker.number.int({ min: 1, max: 99999 }),
      city_id: faker.helpers.arrayElement(cityIds),
      country_id: faker.helpers.arrayElement(countryIds),
      user_id: isUserAddress ? faker.helpers.arrayElement(userIds) : null,
      company_id: !isUserAddress ? faker.helpers.arrayElement(companyIds) : null,
      street1: faker.location.streetAddress(),
      street2: Math.random() > 0.7 ? faker.location.secondaryAddress() : null,
      is_primary: faker.datatype.boolean(),
      address_type: randomEnum(addressTypes),
      name: faker.company.name(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  await bulkInsert(pool, 'addresses', addresses)
}

export async function seedFeedback(pool: Pool, userIds: string[]): Promise<any> {
  const feedbackTypes: FeedbackType[] = [
    'bug_report',
    'feature_request',
    'user_interface_issue',
    'performance_issue',
    'documentation',
  ]
  const feedbackStatuses: FeedbackStatus[] = [
    'new',
    'under_review',
    'backlog',
    'working_on',
    'resolved',
    'rejected',
    'deferred',
  ]

  const feedback = [...Array(faker.number.int({ min: 20, max: 50 }))].map(() => ({
    id: faker.number.int({ min: 1, max: 99999 }),
    user_id: faker.helpers.arrayElement(userIds),
    message: faker.lorem.paragraph(),
    feedback_type: randomEnum(feedbackTypes),
    feedback_status: randomEnum(feedbackStatuses),
    page_identifier: faker.helpers.arrayElement(['/dashboard', '/companies', '/news', '/research']),
    device_info: JSON.stringify({
      browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari']),
      os: faker.helpers.arrayElement(['Windows', 'MacOS', 'Linux']),
      device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
    }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'feedbacks', feedback)
}

export async function seedFollows(pool: Pool, userIds: string[], contentIds: string[]) {
  const followedEntities: FollowedEntity[] = ['company', 'user']
  const usedCombinations = new Set<string>()
  const follows: Array<{
    id: string
    user_id: string
    followed_id: string
    followed_entity: FollowedEntity
    created_at: Date
  }> = []

  // Process each user
  for (const userId of userIds) {
    // Decide how many follows this user will have
    const numberOfFollows = faker.number.int({ min: 1, max: 10 })
    let attempts = 0
    const maxAttempts = 20 // Prevent infinite loops

    while (
      follows.filter((f) => f.user_id === userId).length < numberOfFollows &&
      attempts < maxAttempts
    ) {
      const followed_entity = randomEnum(followedEntities)
      let followed_id: string

      // Select appropriate followed_id based on entity type
      if (followed_entity === 'user') {
        // Don't allow self-follows
        const potentialUsers = userIds.filter((id) => id !== userId)
        followed_id = faker.helpers.arrayElement(potentialUsers)
      } else {
        followed_id = faker.helpers.arrayElement(contentIds)
      }

      // Create unique combination key
      const combinationKey = `${userId}-${followed_id}-${followed_entity}`

      // Only add if this combination hasn't been used
      if (!usedCombinations.has(combinationKey)) {
        usedCombinations.add(combinationKey)
        follows.push({
          id: generateUUID(),
          user_id: userId,
          followed_id,
          followed_entity,
          created_at: faker.date.past(),
        })
      }

      attempts++
    }
  }

  if (follows.length > 0) {
    await bulkInsert(pool, 'follows', follows)
  }
  return follows
}

export async function seedSocialMedia(pool: Pool, count: number) {
  const socialMedia = Array.from({ length: count }, () => ({
    // Remove id field and let PostgreSQL handle it
    youtube_url: Math.random() > 0.5 ? `https://youtube.com/${faker.internet.username()}` : null,
    twitter_url: Math.random() > 0.5 ? `https://twitter.com/${faker.internet.username()}` : null,
    facebook_url: Math.random() > 0.5 ? `https://facebook.com/${faker.internet.username()}` : null,
    linkedin_url:
      Math.random() > 0.5 ? `https://linkedin.com/company/${faker.company.buzzNoun()}` : null,
    instagram_url:
      Math.random() > 0.5 ? `https://instagram.com/${faker.internet.username()}` : null,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  const result = await bulkInsert(pool, 'social_media', socialMedia)
  return result.rows // This will include the generated IDs
}

export async function seedCategories(pool: Pool, count: number) {
  const categoryNames = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Energy',
    'Transportation',
    'Retail',
    'Education',
    'Entertainment',
    'Real Estate',
    'Agriculture',
    'Construction',
    'Telecommunications',
    'Aerospace',
    'Biotechnology',
    'Environmental',
    'Food & Beverage',
    'Automotive',
    'Media',
    'Consulting',
  ]

  const categories = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: i < categoryNames.length ? categoryNames[i] : faker.commerce.department(),
    body: faker.lorem.paragraph(),
    published_at: faker.date.past().toISOString(),
    locale: 'en',
    document_id: generateUUID(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'categories', categories)
  return categories
}

export async function seedNewsSummaries(pool: Pool, news: any[]) {
  // Helper function to get first 60 words
  const getFirst60Words = (text: string): string => {
    const words = text.split(/\s+/)
    return words.slice(0, 34).join(' ')
  }

  try {
    // First, delete any existing summaries for these news items
    await pool.query('DELETE FROM news_summaries WHERE news_id = ANY($1)', [news.map((n) => n.id)])

    // Create summaries for each complexity level
    const complexityLevels = ['beginner', 'intermediate', 'expert', 'undefined'] as const
    const summaries = news.flatMap((newsItem) =>
      complexityLevels.map((level) => ({
        news_id: newsItem.id,
        summary: getFirst60Words(newsItem.body),
        version: 1,
        complexity_level: level,
        is_current: true,
      })),
    )

    if (summaries.length > 0) {
      // Create the parameterized query
      const valueParams: any[] = []
      const valuePlaceholders = summaries.map((_, index) => {
        const offset = index * 5 // 5 parameters per summary
        valueParams.push(
          summaries[index].news_id,
          summaries[index].summary,
          summaries[index].version,
          summaries[index].complexity_level,
          summaries[index].is_current,
        )
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
      })

      const query = `
        INSERT INTO news_summaries (
          news_id, summary, version, complexity_level, is_current
        )
        VALUES ${valuePlaceholders.join(',')}
        RETURNING id
      `

      const result = await pool.query(query, valueParams)
      return result.rows
    }

    return []
  } catch (error: any) {
    console.error('Error in seedNewsSummaries:', error)
    throw error
  }
}

export async function seedNews(
  pool: Pool,
  content: any[],
  companyIds: string[],
  contentSourceIds: number[],
) {
  const usedUrls = new Set<string>()
  const newsStatuses = getContentStatusFlow('news')

  const news = content.map((item) => {
    const contentStatus = faker.helpers.arrayElement(newsStatuses)
    return {
      id: item.id,
      url: generateUniqueUrl(usedUrls, 'https://', '.com/news'),
      category_id: 16,
      has_summary: false,
      scrape_frequency: 'daily' as const,
      content_status: contentStatus,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      description: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      company_id: faker.helpers.arrayElement(companyIds),
      content_source_id: faker.helpers.arrayElement(contentSourceIds),
      published_at: item.created_at,
      hash: BigInt(faker.number.int({ min: 1000000, max: 9999999 })),
      failed_count: faker.number.int({ min: 0, max: 5 }),
      keywords: JSON.stringify(Array.from({ length: 5 }, () => faker.word.noun())),
      featured_image: Math.random() > 0.5 ? faker.image.url() : null,
      scraped_at: faker.date.past(),
    }
  })

  // First insert the news entries
  await bulkInsert(pool, 'news', news)

  // Then create corresponding content statuses
  await createContentStatuses(pool, news, 'news')

  await seedNewsSummaries(pool, news)

  return news
}

export async function seedResearch(pool: Pool, contentIds: string[]) {
  const usedUrls = new Set<string>()
  const researchStatuses = getContentStatusFlow('research')

  const research = contentIds.map((id) => {
    const contentStatus = faker.helpers.arrayElement(researchStatuses)
    return {
      id,
      title: faker.lorem.sentence(),
      abstract: faker.lorem.paragraphs(2),
      abstract_url: generateUniqueUrl(usedUrls, 'https://', '.com/research'),
      authors: JSON.stringify([{ name: faker.person.fullName(), email: faker.internet.email() }]),
      content_status: contentStatus,
      published_at: faker.date.past(),
      created_at: faker.date.past(),
      keywords: faker.lorem.words(5),
      affiliations: JSON.stringify([faker.company.name()]),
    }
  })

  // Insert research entries
  await bulkInsert(pool, 'research', research)

  // Create corresponding content statuses
  await createContentStatuses(pool, research, 'research')

  return research
}

export async function seedCompanies(pool: Pool, count: number) {
  const companies = Array.from({ length: count }, () => {
    const id = generateUUID()
    const contentStatus = faker.helpers.arrayElement(['draft', 'published', 'archived'] as const)
    return {
      id,
      name: faker.company.name(),
      url: faker.internet.url(),
      description: faker.company.catchPhrase(),
      category: faker.company.buzzPhrase(),
      content_status: contentStatus, // This field exists directly on companies table
      is_english: true,
      founding_year: faker.number.int({ min: 1900, max: 2024 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Insert company entries
  await bulkInsert(pool, 'companies', companies)

  return companies
}

export async function seedNewsletters(pool: Pool, contentIds: string[]) {
  const newsletters = contentIds.map((id) => {
    const startDate = faker.date.future()
    const frequency = faker.helpers.arrayElement(['daily', 'weekly', 'monthly'])
    const contentStatus = faker.helpers.arrayElement(['draft', 'scheduled', 'published'] as const)

    const endDate = new Date(startDate)
    switch (frequency) {
      case 'daily':
        endDate.setDate(endDate.getDate() + 30)
        break
      case 'weekly':
        endDate.setDate(endDate.getDate() + 90)
        break
      case 'monthly':
        endDate.setDate(endDate.getDate() + 365)
        break
    }

    return {
      id,
      title: `${faker.company.catchPhrase()} Newsletter`,
      frequency,
      start_date: startDate,
      end_date: endDate,
      content_status: contentStatus,
      generated_content: faker.lorem.paragraphs(5),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Insert newsletter entries
  await bulkInsert(pool, 'newsletters', newsletters)

  // Create corresponding content statuses
  await createContentStatuses(pool, newsletters, 'newsletter')

  return newsletters
}

export async function seedFeedCategories(pool: Pool, feedIds: string[], categoryIds: number[]) {
  // Track used IDs
  const usedIds = new Set<number>()

  // Create feed categories - each feed will have 1-3 categories
  const feedCategories = feedIds.flatMap((feedId) =>
    // For each feed, create 1-3 category associations
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: generateUniqueId(1, 99999, usedIds),
      feed_id: feedId,
      category_id: faker.helpers.arrayElement(categoryIds),
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'feed_categories', feedCategories)
  return feedCategories
}

export async function seedFeeds(pool: Pool, userIds: string[]) {
  const feeds = Array.from({ length: faker.number.int({ min: 20, max: 50 }) }, () => ({
    id: generateUUID(),
    name: faker.helpers.arrayElement([
      'Industry News',
      'Company Updates',
      'Research Digest',
      'Tech Trends',
      'Market Analysis',
      'Competitor Watch',
      'Innovation Feed',
      'Startup News',
    ]),
    user_id: faker.helpers.arrayElement(userIds),
    created_at: faker.date.past(),
  }))

  await bulkInsert(pool, 'feeds', feeds)
  return feeds
}

export async function seedContentCategories(
  pool: Pool,
  contentIds: string[],
  categoryIds: number[],
) {
  // Track combinations to ensure no duplicates
  const usedCombinations = new Set<string>()
  const contentCategories: Array<{
    content_id: string
    category_id: number
    is_primary: boolean
  }> = []

  // Each content should have 1-3 categories, with one primary
  for (const contentId of contentIds) {
    // Randomly select how many categories this content will have (1-3)
    const numCategories = faker.number.int({ min: 1, max: 3 })

    // Shuffle and take first n categories
    const selectedCategoryIds = faker.helpers.shuffle([...categoryIds]).slice(0, numCategories)

    // First category will be primary
    selectedCategoryIds.forEach((categoryId, index) => {
      const combinationKey = `${contentId}-${categoryId}`

      if (!usedCombinations.has(combinationKey)) {
        usedCombinations.add(combinationKey)
        contentCategories.push({
          content_id: contentId,
          category_id: categoryId,
          is_primary: index === 0, // First category is primary
        })
      }
    })
  }

  await bulkInsert(pool, 'content_categories', contentCategories)
  return contentCategories
}

export async function seedContentTags(pool: Pool, contentIds: string[], tagIds: number[]) {
  // Track combinations to ensure no duplicates
  const usedCombinations = new Set<string>()
  const contentTags: Array<{
    content_id: string
    tag_id: number
  }> = []

  // Each content can have 0-5 tags
  for (const contentId of contentIds) {
    // Randomly select how many tags this content will have (0-5)
    const numTags = faker.number.int({ min: 0, max: 5 })

    // Shuffle and take first n tags
    const selectedTagIds = faker.helpers.shuffle([...tagIds]).slice(0, numTags)

    selectedTagIds.forEach((tagId) => {
      const combinationKey = `${contentId}-${tagId}`

      if (!usedCombinations.has(combinationKey)) {
        usedCombinations.add(combinationKey)
        contentTags.push({
          content_id: contentId,
          tag_id: tagId,
        })
      }
    })
  }

  await bulkInsert(pool, 'content_tags', contentTags)
  return contentTags
}

export async function seedTags(pool: Pool) {
  // Common tags that might be used across different content
  const commonTags = [
    'Technology',
    'Innovation',
    'AI',
    'Machine Learning',
    'Cloud Computing',
    'Sustainability',
    'Green Tech',
    'Renewable Energy',
    'FinTech',
    'Blockchain',
    'Healthcare',
    'Biotech',
    'Digital Transformation',
    'IoT',
    'Cybersecurity',
    'Remote Work',
    'Future of Work',
    'E-commerce',
    'Supply Chain',
    'Data Science',
    'Space Tech',
    'Quantum Computing',
    'AR/VR',
    '5G',
    'Robotics',
    'Smart Cities',
    'AgTech',
    'EdTech',
    'Clean Energy',
    'Digital Health',
  ]

  // Track used values
  const usedIds = new Set<number>()
  const usedNames = new Set<string>()

  // First create tags from our predefined list
  const tags = commonTags.map((tagName) => {
    usedNames.add(tagName) // Add to used names
    return {
      id: generateUniqueId(1, 99999, usedIds),
      name: tagName,
      body: faker.lorem.sentence(),
      document_id: faker.string.uuid(),
      published_at: faker.date.past().toISOString(),
      locale: 'en',
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Generate additional random tags
  const additionalTags = Array.from({ length: 20 }, () => {
    // Generate unique name
    const name = generateUniqueValue(
      () => `${faker.commerce.department()} ${faker.word.noun()}`, // More variety
      usedNames,
      100,
    )

    return {
      id: generateUniqueId(1, 99999, usedIds),
      name,
      body: faker.lorem.sentence(),
      document_id: faker.string.uuid(),
      published_at: faker.date.past().toISOString(),
      locale: faker.helpers.arrayElement(['en', 'es', 'fr', 'de']),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  const allTags = [...tags, ...additionalTags]
  await bulkInsert(pool, 'tags', allTags)
  return allTags
}

export async function seedNewsTags(pool: Pool, newsIds: string[], tagIds: number[]) {
  // First, get the numeric IDs for the news entries
  const { rows: newsRows } = await pool.query(
    `
    SELECT CAST(split_part(id::text, '-', 1) AS bigint) as news_id 
    FROM news 
    WHERE id = ANY($1)
  `,
    [newsIds],
  )

  const numericNewsIds = newsRows.map((row) => row.news_id)

  // Track combinations to ensure no duplicates
  const usedCombinations = new Set<string>()
  const usedIds = new Set<number>()

  const newsTags: Array<{
    id: number
    news_id: number // Changed to number for bigint compatibility
    tag_id: number
  }> = []

  // Each news item can have 2-5 tags
  for (const newsId of numericNewsIds) {
    // Randomly select how many tags this news will have
    const numTags = faker.number.int({ min: 2, max: 5 })

    // Shuffle and take first n tags
    const selectedTagIds = faker.helpers.shuffle([...tagIds]).slice(0, numTags)

    selectedTagIds.forEach((tagId) => {
      const combinationKey = `${newsId}-${tagId}`

      if (!usedCombinations.has(combinationKey)) {
        usedCombinations.add(combinationKey)
        newsTags.push({
          id: generateUniqueId(1, 99999, usedIds),
          news_id: newsId,
          tag_id: tagId,
        })
      }
    })
  }

  await bulkInsert(pool, 'news_tags', newsTags)
  return newsTags
}

export async function seedFeedSources(pool: Pool, feedIds: string[], contentSourceIds: string[]) {
  // Track used IDs
  const usedIds = new Set<number>()

  // Create feed sources - each feed will have 1-5 sources
  const feedSources = feedIds.flatMap((feedId) =>
    // For each feed, create 1-5 source associations
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      feed_id: feedId,
      content_source_id: faker.helpers.arrayElement(contentSourceIds), // Link to content_sources
      created_at: faker.date.past(),
    })),
  )

  await bulkInsert(pool, 'feed_sources', feedSources)
  return feedSources
}

// Add to your seeders.ts file

export async function seedFeatureRequests(pool: Pool) {
  const features = [
    {
      id: generateUUID(),
      title: 'Company Database Launch',
      description:
        'Comprehensive database of space industry companies including funding history, key personnel, and market segments',
      status: 'in_progress',
      upvotes: faker.number.int({ min: 50, max: 200 }),
      downvotes: faker.number.int({ min: 0, max: 30 }),
      priority_score: 0, // Will be calculated
      engagement_score: 0, // Will be calculated
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Job Board and Tracking System',
      description:
        'Automated job aggregation from space industry companies with AI-powered categorization and skill matching',
      status: 'planned',
      upvotes: faker.number.int({ min: 40, max: 150 }),
      downvotes: faker.number.int({ min: 0, max: 20 }),
      priority_score: 0,
      engagement_score: 0,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Daily Space Industry Newsletter',
      description: 'AI-curated daily digest of space industry news with automated summarization',
      status: 'planned',
      upvotes: faker.number.int({ min: 30, max: 120 }),
      downvotes: faker.number.int({ min: 0, max: 15 }),
      priority_score: 0,
      engagement_score: 0,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Launch Calendar Integration',
      description:
        'Interactive calendar for upcoming launches, satellite deployments, and industry events',
      status: 'planned',
      upvotes: faker.number.int({ min: 25, max: 100 }),
      downvotes: faker.number.int({ min: 0, max: 10 }),
      priority_score: 0,
      engagement_score: 0,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Investment Analytics Dashboard',
      description:
        'Track and visualize investment activities, funding rounds, and market trends in the space industry',
      status: 'planned',
      upvotes: faker.number.int({ min: 20, max: 80 }),
      downvotes: faker.number.int({ min: 0, max: 12 }),
      priority_score: 0,
      engagement_score: 0,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
  ].map((feature) => ({
    ...feature,
    priority_score: feature.upvotes - feature.downvotes,
    engagement_score: feature.upvotes + feature.downvotes,
  }))

  await bulkInsert(pool, 'feature_requests', features)
  return features
}

export async function seedFeatureVotes(pool: Pool, userIds: string[], features: any[]) {
  const votes: any[] = []

  // Generate some votes for each user
  userIds.forEach((userId) => {
    // Each user votes on 2-4 random features
    const numVotes = faker.number.int({ min: 2, max: 4 })
    const shuffledFeatures = faker.helpers.shuffle([...features])

    for (let i = 0; i < numVotes; i++) {
      const feature = shuffledFeatures[i]
      votes.push({
        id: generateUUID(),
        feature_id: feature.id,
        user_id: userId,
        vote_type: faker.helpers.arrayElement([1, -1]), // Random upvote or downvote
        feedback: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }), // 30% chance of feedback
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      })
    }
  })

  await bulkInsert(pool, 'feature_votes', votes)
  return votes
}

export async function seedContentSourceVisits(pool: Pool, userIds: string[], contentIds: string[]) {
  // Get valid content IDs and their types
  const { rows: validContent } = await pool.query(
    `
    SELECT id, content_type FROM contents WHERE id = ANY($1)
  `,
    [contentIds],
  )

  const visits = [] as any[]
  const visitsPerUser = faker.number.int({ min: 5, max: 20 })

  // More realistic content type weights
  const contentTypeWeights = {
    news: 0.45, // Most common
    research: 0.15, // Higher value content
    events: 0.1, // Occasional
    jobs: 0.1, // Job searches
    newsletters: 0.1, // Newsletter views
    people: 0.05, // People profiles
    contact: 0.03, // Contact pages
    unknown: 0.02, // Edge cases
  }

  for (const userId of userIds) {
    for (let i = 0; i < visitsPerUser; i++) {
      const contentType = faker.helpers.weightedArrayElement(
        Object.entries(contentTypeWeights).map(([key, weight]) => ({
          value: key,
          weight,
        })),
      )

      const typeContent = validContent.filter((c) => c.content_type === contentType)

      if (typeContent.length > 0) {
        visits.push({
          id: generateUUID(),
          user_id: userId,
          content_id: faker.helpers.arrayElement(typeContent).id,
          created_at: faker.date.recent(),
        })
      }
    }
  }

  if (visits.length > 0) {
    await bulkInsert(pool, 'content_source_visits', visits)
  } else {
    console.log('No content found for source visits')
  }

  return visits
}

export async function seedUserMetrics(pool: Pool, userIds: string[]) {
  const metrics = userIds.map((userId) => {
    const totalVotes = faker.number.int({ min: 0, max: 100 })
    const upvotes = faker.number.int({ min: 0, max: totalVotes })
    const downvotes = totalVotes - upvotes
    const accuracy = faker.number.int({ min: 60, max: 100 })
    const streak = faker.number.int({ min: 0, max: 14 })
    const bestStreak = faker.number.int({ min: streak, max: 30 })

    return {
      id: generateUUID(),
      user_id: userId,
      total_votes: totalVotes,
      upvote_count: upvotes,
      downvote_count: downvotes,
      vote_accuracy: accuracy,
      current_streak: streak,
      best_streak: bestStreak,
      today_vote_count: faker.number.int({ min: 0, max: 10 }),
      total_reading_time: faker.number.int({ min: 0, max: 3600 }),
      last_vote_date: faker.date.recent(),
      points: faker.number.int({ min: 0, max: 1000 }),
      current_level: faker.number.int({ min: 1, max: 10 }),
      current_xp: faker.number.int({ min: 0, max: 100 }),
      xp_to_next_level: 100,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      // Use default JSONB values for complex fields
      points_breakdown: null,
      interaction_stats: null,
      achievements: null,
      titles: null,
      multipliers: null,
    }
  })

  await bulkInsert(pool, 'user_metrics', metrics)
  return metrics
}

export async function seedErrorLogs(pool: Pool, userIds: string[], count = 1000) {
  const logs = []
  let currentTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Start 7 days ago

  // Generate clusters of related errors
  for (let i = 0; i < count; i++) {
    const useCommonError = Math.random() < 0.7 // 70% chance of using a common error
    const errorTemplate = useCommonError
      ? faker.helpers.arrayElement(COMMON_ERRORS)
      : {
          message: faker.helpers.arrayElement(ERROR_MESSAGES),
          pattern: faker.helpers.arrayElement(ERROR_MESSAGES),
          hash: createHash('md5').update(faker.helpers.arrayElement(ERROR_MESSAGES)).digest('hex'),
          services: [faker.helpers.arrayElement(SERVICE_NAMES)],
        }

    // For each error, maybe generate a related error within 5 minutes
    const primaryError = {
      id: generateUUID(),
      service_name: faker.helpers.arrayElement(errorTemplate.services),
      error_type: faker.helpers.arrayElement(ERROR_TYPES),
      severity: faker.helpers.arrayElement(SEVERITIES),
      message: errorTemplate.message,
      stack_trace: generateStackTrace(errorTemplate.message),
      metadata: {
        browser: faker.helpers.maybe(() => faker.internet.userAgent(), { probability: 0.7 }),
        os: faker.helpers.maybe(() => 'windows', { probability: 0.7 }),
        ip: faker.helpers.maybe(() => faker.internet.ip(), { probability: 0.8 }),
        path: faker.helpers.maybe(() => '/' + faker.system.directoryPath(), { probability: 0.9 }),
        method: faker.helpers.maybe(
          () => faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
          { probability: 0.9 },
        ),
      },
      context: {
        action: faker.helpers.maybe(() => faker.hacker.verb(), { probability: 0.8 }),
        component: faker.helpers.maybe(
          () => faker.helpers.arrayElement(['UserProfile', 'Dashboard', 'Settings', 'Auth', 'API']),
          { probability: 0.8 },
        ),
        version: faker.helpers.maybe(() => faker.system.semver(), { probability: 0.7 }),
      },
      user_id: faker.helpers.maybe(() => faker.helpers.arrayElement(userIds), { probability: 0.7 }),
      request_id: generateUUID(),
      correlation_id: generateUUID(),
      environment: faker.helpers.arrayElement(['development', 'staging', 'production']),
      created_at: currentTime,
      error_hash: errorTemplate.hash,
      error_pattern: errorTemplate.pattern,
      is_new_pattern: false,
    }

    logs.push(primaryError)

    if (Math.random() < 0.4) {
      const otherServices = errorTemplate.services.filter((s) => s !== primaryError.service_name)

      // Only create related error if there are other services available
      if (otherServices.length > 0) {
        const relatedError = {
          ...primaryError,
          id: generateUUID(),
          service_name: faker.helpers.arrayElement(otherServices),
          created_at: new Date(
            currentTime.getTime() + faker.number.int({ min: 1, max: 300 }) * 1000,
          ), // 0-5 minutes later
          request_id: generateUUID(),
          correlation_id: generateUUID(),
        }
        logs.push(relatedError)
      }
    }

    // Advance time by 1-60 minutes
    currentTime = new Date(
      currentTime.getTime() + faker.number.int({ min: 1, max: 60 }) * 60 * 1000,
    )
  }

  await bulkInsert(pool, 'error_logs', logs)
  return logs
}

// ADS

// Helper for generating ad content variants
function generateAdContent() {
  return {
    title: faker.company.catchPhrase(),
    description: faker.company.buzzPhrase(),
    featured_image: faker.image.urlLoremFlickr({ category: 'technology' }),
    background_image: faker.image.urlLoremFlickr({ category: 'space' }),
    cta_text: faker.helpers.arrayElement([
      'Learn More',
      'Get Started',
      'Discover Now',
      'See Details',
      'Join Today',
    ]),
    cta_url: faker.internet.url(),
    tagline: faker.company.catchPhrase(),
  }
}

export async function seedAdPackages(pool: Pool) {
  const packages = [
    {
      id: generateUUID(),
      name: 'Orbital Premium',
      position: 'top',
      description: 'Premium visibility with top banner placement',
      price: 2000.0,
      features: [
        'Top banner placement',
        'Maximum visibility across platform',
        'Custom branding options',
        'Advanced A/B testing',
        'Real-time analytics dashboard',
        'Priority support channel',
      ],
      active: true,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      name: 'Deep Space Feed',
      position: 'feed',
      description: 'Seamless integration in content feed',
      price: 1000.0,
      features: [
        'Strategic feed placement',
        'Native content integration',
        'Basic analytics package',
        'Standard A/B testing',
        'Regular support access',
      ],
      active: true,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      name: 'Newsletter Sponsor',
      position: 'newsletter',
      description: 'Reach our dedicated subscriber base',
      price: 1500.0,
      features: [
        'Featured newsletter placement',
        'Targeted audience reach',
        'Performance tracking',
        'Custom email templates',
        'Engagement analytics',
      ],
      active: true,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
  ]

  await bulkInsert(pool, 'ad_packages', packages)
  return packages
}

export async function seedAds(pool: Pool, companyIds: string[], packageIds: string[]) {
  const ads = Array.from({ length: 10 }, () => {
    // Start date between now and 7 days ago
    const startDate = faker.date.between({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    })

    // End date one year from start date
    const endDate = new Date(startDate)
    endDate.setFullYear(endDate.getFullYear() + 1)

    return {
      id: generateUUID(),
      company_id: faker.helpers.arrayElement(companyIds),
      package_id: faker.helpers.arrayElement(packageIds),
      start_date: startDate,
      end_date: endDate,
      active: true,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  await bulkInsert(pool, 'ads', ads)
  return ads
}

export async function seedAdVariants(pool: Pool, adIds: string[]) {
  const variants = adIds.flatMap((adId) =>
    // Create 2-3 variants for each ad
    Array.from({ length: faker.number.int({ min: 2, max: 3 }) }, (_, index) => ({
      id: generateUUID(),
      ad_id: adId,
      content: generateAdContent(),
      is_control: index === 0, // First variant is control
      active: true,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    })),
  )

  await bulkInsert(pool, 'ad_variants', variants)
  return variants
}

export async function seedAdDailyMetrics(pool: Pool, variantIds: string[]) {
  // Generate 30 days of metrics for each variant
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const metrics = variantIds.flatMap((variantId) =>
    Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo)
      date.setDate(date.getDate() + i)

      return {
        id: generateUUID(),
        variant_id: variantId,
        date: date.toISOString().split('T')[0],
        views: faker.number.int({ min: 100, max: 1000 }),
        clicks: faker.number.int({ min: 5, max: 50 }),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
      }
    }),
  )

  await bulkInsert(pool, 'ad_daily_metrics', metrics)
  return metrics
}

export async function seedReferrers(pool: Pool, userIds: string[]) {
  return ['ruturaj', 'shweta', 'ruchira', 'mac'].map((code) => ({
    referrer_code: code,
  }))
}

export async function seedReferrals(pool: Pool, referrers: any[]) {
  const referrals: any[] = []

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)

  const generateRecentDate = () => {
    const daysAgo = faker.number.int({ min: 0, max: 7 })
    const hoursInDay = faker.number.int({ min: 0, max: 23 })
    const minutesInHour = faker.number.int({ min: 0, max: 59 })

    const date = new Date(endDate)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(hoursInDay, minutesInHour)
    return date
  }

  // Helper to generate conversion date
  const generateConversionDate = (creationDate: Date) => {
    // Generate conversion between 1 min and 12 hours after creation
    const conversionDate = new Date(creationDate)
    conversionDate.setMinutes(
      conversionDate.getMinutes() + faker.number.int({ min: 1, max: 12 * 60 }), // Random minutes up to 12 hours
    )

    // If conversion would be after now, cap it to now
    return conversionDate > endDate ? endDate : conversionDate
  }

  // More varied data
  const deviceTypes = ['desktop', 'mobile', 'tablet']
  const deviceDistribution = [50, 35, 15] // percentages
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
  const browserDistribution = [45, 25, 20, 10] // percentages
  const countryCodes = ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'FR', 'JP']
  const regions = {
    US: ['California', 'New York', 'Texas'],
    GB: ['England', 'Scotland', 'Wales'],
    IN: ['Maharashtra', 'Karnataka', 'Delhi'],
    // Add more as needed
  }

  for (const referrer of referrers) {
    // Generate 15-40 referrals per referrer for better distribution
    const numReferrals = faker.number.int({ min: 15, max: 40 })

    for (let i = 0; i < numReferrals; i++) {
      const createdAt = generateRecentDate()

      // Better status distribution
      const status = faker.helpers.weightedArrayElement([
        { value: 'pending', weight: 40 },
        { value: 'converted', weight: 35 },
        { value: 'abandoned', weight: 25 },
      ]) as 'pending' | 'converted' | 'abandoned'

      const countryCode = faker.helpers.arrayElement(countryCodes)

      const convertedAt = status === 'converted' ? generateConversionDate(createdAt) : null

      referrals.push({
        id: generateUUID(),
        referrer_code: referrer.referrer_code,
        visitor_id: generateUUID(),
        created_at: createdAt,
        converted_at: convertedAt,
        referral_status: status,
        conversion_value:
          status === 'converted'
            ? faker.number.float({ min: 100, max: 2000, fractionDigits: 2 })
            : null,
        user_agent: faker.internet.userAgent(),
        ip_address: faker.internet.ip(),
        landing_page: faker.helpers.weightedArrayElement([
          { value: '/', weight: 40 },
          { value: '/products', weight: 25 },
          { value: '/pricing', weight: 20 },
          { value: '/about', weight: 15 },
        ]),
        utm_source: faker.helpers.maybe(
          () =>
            faker.helpers.weightedArrayElement([
              { value: 'google', weight: 40 },
              { value: 'facebook', weight: 30 },
              { value: 'twitter', weight: 20 },
              { value: 'linkedin', weight: 10 },
            ]),
          { probability: 0.8 },
        ),
        utm_medium: faker.helpers.maybe(
          () =>
            faker.helpers.weightedArrayElement([
              { value: 'cpc', weight: 35 },
              { value: 'social', weight: 35 },
              { value: 'email', weight: 30 },
            ]),
          { probability: 0.8 },
        ),
        utm_campaign: faker.helpers.maybe(
          () =>
            faker.helpers.weightedArrayElement([
              { value: 'spring2024', weight: 40 },
              { value: 'launch', weight: 30 },
              { value: 'promo', weight: 30 },
            ]),
          { probability: 0.8 },
        ),
        device_type: faker.helpers.weightedArrayElement(
          deviceTypes.map((type, index) => ({
            value: type,
            weight: deviceDistribution[index],
          })),
        ),
        browser: faker.helpers.weightedArrayElement(
          browsers.map((browser, index) => ({
            value: browser,
            weight: browserDistribution[index],
          })),
        ),
        country_code: countryCode,
        region: faker.helpers.arrayElement(regions[countryCode] || ['Unknown']),
        is_suspicious: faker.helpers.maybe(() => true, { probability: 0.05 }),
        security_flags: faker.helpers.maybe(
          () => JSON.stringify(['suspicious_ip', 'multiple_attempts']),
          { probability: 0.05 },
        ),
        validation_attempts: faker.number.int({ min: 1, max: 5 }),
        last_failed_attempt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.1 }),
        client_fingerprint: faker.string.alphanumeric(32),
      })
    }
  }

  await bulkInsert(pool, 'referrals', referrals)
  return referrals
}

export async function seedBlockedIPs(pool: Pool) {
  const numBlocked = faker.number.int({ min: 3, max: 8 })
  const blockedIPs = []

  for (let i = 0; i < numBlocked; i++) {
    const blockedAt = faker.date.recent()
    blockedIPs.push({
      id: generateUUID(),
      ip_address: faker.internet.ip(),
      blocked_at: blockedAt,
      blocked_until: faker.date.future({ refDate: blockedAt }),
      failed_attempts: faker.number.int({ min: 3, max: 10 }),
      reason: faker.helpers.arrayElement([
        'Rate limit exceeded',
        'Suspicious activity detected',
        'Multiple failed attempts',
        'Bot behavior detected',
      ]),
      created_at: blockedAt,
      updated_at: faker.date.recent(),
    })
  }

  console.log(`Seeding ${blockedIPs.length} blocked IPs`)
  await bulkInsert(pool, 'blocked_ips', blockedIPs)
  return blockedIPs
}

export async function seedReferrerBlocks(pool: Pool, referrers: any[]) {
  // Block ~20% of referrers
  const blockedCount = Math.max(1, Math.floor(referrers.length * 0.2))
  const blockedReferrers = faker.helpers.shuffle([...referrers]).slice(0, blockedCount)

  const blocks = blockedReferrers.map((referrer) => {
    const blockedAt = faker.date.recent()
    return {
      id: generateUUID(),
      referrer_code: referrer.referrer_code,
      blocked_at: blockedAt,
      blocked_by: 'admin',
      reason: faker.helpers.arrayElement([
        'Suspicious referral pattern',
        'Terms of service violation',
        'Fraudulent activity detected',
        'Multiple suspicious conversions',
      ]),
      is_permanent: faker.datatype.boolean(),
      created_at: blockedAt,
      updated_at: faker.date.recent(),
    }
  })

  console.log(`Seeding ${blocks.length} referrer blocks`)
  await bulkInsert(pool, 'referrer_blocks', blocks)
  return blocks
}
