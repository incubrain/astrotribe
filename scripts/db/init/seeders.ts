import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import {
  bulkInsert,
  generateUUID,
  generateUniqueId,
  generateUniqueUrl,
  generateUniqueValue,
} from './seed-helpers'

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

    contents.push({
      id: generateUUID(),
      url,
      content_type: faker.helpers.arrayElement(['companies', 'news', 'research', 'newsletters']),
      title: faker.company.name(),
      rss_url: rssUrl,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
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

export async function seedBookmarks(
  pool: Pool,
  folderIds: string[],
  contents: any[],
  userIds: string[],
): Promise<any> {
  const bookmarks = contents.map((content) => ({
    id: generateUUID(),
    user_id: faker.helpers.arrayElement(userIds),
    content_id: content.id,
    content_type: content.content_type,
    folder_id: faker.helpers.arrayElement(folderIds),
    metadata: { notes: faker.lorem.sentence() },
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'bookmarks', bookmarks)
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
      content_type: faker.helpers.arrayElement(['companies', 'news', 'research']),
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
      const contentType = faker.helpers.arrayElement(['companies', 'news', 'research'])

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
    'companies',
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
      user_profile_id: faker.helpers.arrayElement(userIds),
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
    follower_id: string
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
      follows.filter((f) => f.follower_id === userId).length < numberOfFollows &&
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
          follower_id: userId,
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

export async function seedNews(
  pool: Pool,
  contentIds: string[],
  companyIds: string[],
  contentSourceIds: number[],
) {
  const usedUrls = new Set<string>()
  const newsStatuses = getContentStatusFlow('news')

  const news = contentIds.map((id) => {
    const contentStatus = faker.helpers.arrayElement(newsStatuses)
    return {
      id,
      url: generateUniqueUrl(usedUrls, 'https://', '.com/news'),
      category_id: 16n,
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
      published_at: faker.date.past(),
      hash: BigInt(faker.number.int({ min: 1000000, max: 9999999 })),
      failed_count: faker.number.int({ min: 0, max: 5 }),
      keywords: JSON.stringify(Array.from({ length: 5 }, () => faker.word.noun())),
      score: faker.number.int({ min: 0, max: 100 }),
      featured_image: Math.random() > 0.5 ? faker.image.url() : null,
      scraped_at: faker.date.past(),
    }
  })

  // First insert the news entries
  await bulkInsert(pool, 'news', news)

  // Then create corresponding content statuses
  await createContentStatuses(pool, news, 'news')

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

export async function seedCompanies(pool: Pool, contentIds: string[]) {
  const companies = contentIds.map((id) => {
    const contentStatus = faker.helpers.arrayElement(['draft', 'published', 'archived'] as const)
    return {
      id,
      name: faker.company.name(),
      url: faker.internet.url(),
      description: faker.company.catchPhrase(),
      category: faker.company.buzzPhrase(),
      content_status: contentStatus,
      is_english: true,
      founding_year: faker.number.int({ min: 1900, max: 2024 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  // Insert company entries
  await bulkInsert(pool, 'companies', companies)

  // Create corresponding content statuses
  await createContentStatuses(pool, companies, 'company')

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
      source_id: faker.helpers.arrayElement(contentSourceIds), // Link to content_sources
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
      title: 'Advanced News Filtering',
      description: 'Filter news by multiple categories, sources, and keywords',
      status: 'planned',
      priority: 1,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Custom News Digest',
      description: 'Personalized daily/weekly email digest of space news',
      status: 'in_progress',
      priority: 2,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    {
      id: generateUUID(),
      title: 'Company Comparisons',
      description: 'Compare multiple space companies side by side',
      status: 'planned',
      priority: 3,
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    },
    // Add more predefined features
  ]

  await bulkInsert(pool, 'feature_requests', features)
  return features
}

export async function seedFeatureRankings(pool: Pool, userIds: string[], featureIds: string[]) {
  const rankings = userIds.map((userId) => ({
    id: generateUUID(),
    user_id: userId,
    rankings: JSON.stringify(faker.helpers.shuffle([...featureIds])),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'feature_rankings', rankings)
  return rankings
}

export async function seedContentSourceVisits(pool: Pool, userIds: string[], contentIds: string[]) {
  // Get valid content IDs and their types
  const { rows: validContent } = await pool.query(
    `
    SELECT id, content_type FROM contents WHERE id = ANY($1)
  `,
    [contentIds],
  )

  const visits = []
  const visitsPerUser = faker.number.int({ min: 5, max: 20 })

  // More realistic content type weights
  const contentTypeWeights = {
    news: 0.45, // Most common
    research: 0.15, // Higher value content
    companies: 0.15, // Company profiles
    events: 0.05, // Occasional
    jobs: 0.05, // Job searches
    newsletters: 0.05, // Newsletter views
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
