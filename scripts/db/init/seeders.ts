import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { bulkInsert, generateUUID } from './seed-helpers'

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

export async function seedCompanies(pool: Pool, contentIds: string[]) {
  const companies = contentIds.map((id) => ({
    id,
    name: faker.company.name(),
    url: faker.internet.url(),
    description: faker.company.catchPhrase(),
    category: faker.company.buzzPhrase(),
    content_status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
    is_english: true,
    founding_year: faker.number.int({ min: 1900, max: 2024 }),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'companies', companies)
  return companies
}

export async function seedNews(pool: Pool, contentIds: string[], companyIds: string[]) {
  const news = contentIds.map((id) => ({
    id,
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(3),
    description: faker.lorem.paragraph(),
    author: faker.person.fullName(),
    company_id: faker.helpers.arrayElement(companyIds),
    published_at: faker.date.past(),
    content_status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
    url: faker.internet.url(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'news', news)
}

export async function seedResearch(pool: Pool, contentIds: string[]) {
  const research = contentIds.map((id) => {
    const year = faker.date.past().getFullYear().toString()
    const month = (faker.date.past().getMonth() + 1).toString().padStart(2, '0')

    return {
      id,
      title: faker.lorem.sentence(),
      abstract: faker.lorem.paragraphs(2),
      keywords: faker.lorem.words(5), // Changed from array to string
      month,
      year,
      abstract_url: faker.internet.url(),
      doi_url:
        Math.random() > 0.5
          ? `https://doi.org/10.${faker.number.int({ min: 1000, max: 9999 })}/${faker.string.alphanumeric(8)}`
          : null,
      pdf_url: Math.random() > 0.5 ? faker.internet.url() : null,
      published_in: faker.company.name(),
      // Properly format JSONB fields
      affiliations: JSON.stringify([faker.company.name(), faker.company.name()]),
      authors: JSON.stringify([
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          affiliation: faker.company.name(),
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          affiliation: faker.company.name(),
        },
      ]),
      content_status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      is_flagged: false,
      comments: faker.lorem.paragraph(),
      table_count: faker.number.int({ min: 0, max: 10 }),
      page_count: faker.number.int({ min: 10, max: 50 }),
      summary: faker.lorem.paragraph(),
      has_embedding: false,
      figure_count: faker.number.int({ min: 0, max: 15 }),
      version: 1,
      published_at: faker.date.past(),
      updated_at: faker.date.recent(),
      created_at: faker.date.past(),
      category: faker.helpers.arrayElement([
        'Computer Science',
        'Physics',
        'Mathematics',
        'Biology',
        'Chemistry',
        'Engineering',
        'Medicine',
        'Economics',
        'Psychology',
        'Social Sciences',
      ]),
    }
  })

  await bulkInsert(pool, 'research', research)
  return research
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
  contentIds: string[],
  userIds: string[],
) {
  const bookmarks = contentIds.map((contentId) => ({
    id: generateUUID(),
    user_id: faker.helpers.arrayElement(userIds),
    content_id: contentId,
    content_type: faker.helpers.arrayElement(['companies', 'news', 'research', 'newsletters']),
    folder_id: faker.helpers.arrayElement(folderIds),
    metadata: { notes: faker.lorem.sentence() },
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  }))

  await bulkInsert(pool, 'bookmarks', bookmarks)
}

export async function seedComments(pool: Pool, contentIds: string[], userIds: string[]) {
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

  await bulkInsert(pool, 'content_sources', sources)
  return sources
}

export async function seedCompanyEmployees(pool: Pool, companyIds: string[], userIds: string[]) {
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

  const contacts = [...Array(faker.number.int({ min: 50, max: 100 }))].map(() => ({
    id: faker.number.int({ min: 1, max: 99999 }),
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
) {
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

export async function seedFeedback(pool: Pool, userIds: string[]) {
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

export async function seedNewsletters(pool: Pool, contentIds: string[]) {
  const frequencies = ['daily', 'weekly', 'monthly']
  const newsletters = contentIds.map((id) => {
    const startDate = faker.date.future()
    const frequency = faker.helpers.arrayElement(frequencies)
    // Calculate end date based on frequency
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
      content_status: faker.helpers.arrayElement([
        'draft',
        'pending_agent_review',
        'scheduled',
        'published',
      ] as ContentStatus[]),
      generated_content: faker.lorem.paragraphs(5),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })

  await bulkInsert(pool, 'newsletters', newsletters)
  return newsletters
}
