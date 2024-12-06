import chalk from 'chalk'
import client from '../../client'
import * as seed from './seeders'
import { checkAndSeed } from './seed-helpers'

interface SeedConfig {
  batchSize: number
  counts: {
    contents: number
    companies: number
    news: number
    research: number
    socialMedia: number
    categories: number
    newsletters: number
  }
}

export async function runSeeders() {
  console.log(chalk.blue('Starting database seeding...'))

  const config = {
    batchSize: 100,
    counts: {
      contents: 1015,
      companies: 400,
      news: 400,
      research: 200,
      socialMedia: 100,
      categories: 20,
      newsletters: 15,
    },
  }

  try {
    // Get list of existing users
    const { rows: users } = await client.query('SELECT id FROM user_profiles')
    const userIds = users.map((u) => u.id)
    if (userIds.length === 0) {
      throw new Error('No users found in user_profiles table')
    }

    await checkAndSeed(client, 'user_metrics', () => seed.seedUserMetrics(client, userIds))

    // 1. Seed reference data first
    const countries = await checkAndSeed(client, 'countries', () => seed.seedCountries(client))

    const cities = await checkAndSeed(client, 'cities', () => seed.seedCities(client))

    const socialMedia = await checkAndSeed(client, 'social_media', () =>
      seed.seedSocialMedia(client, config.counts.socialMedia),
    )

    const categories = await checkAndSeed(client, 'categories', () =>
      seed.seedCategories(client, config.counts.categories),
    )

    const tags = await checkAndSeed(client, 'tags', () => seed.seedTags(client))

    const categoryIds = categories.map((c) => c.id)

    // 2. Seed content and related tables
    const contents = await checkAndSeed(client, 'contents', () =>
      seed.seedContents(client, config.counts.contents),
    )

    const allContentIds = contents.map((c) => c.id)

    // Filter contents by type
    const newsContentIds = contents.filter((c) => c.content_type === 'news').map((c) => c.id)
    const researchContentIds = contents
      .filter((c) => c.content_type === 'research')
      .map((c) => c.id)
    const newsletterContentIds = contents
      .filter((c) => c.content_type === 'newsletters')
      .map((c) => c.id)

    // 3. Seed companies and related data
    const companies = await checkAndSeed(client, 'companies', () =>
      seed.seedCompanies(client, config.counts.companies),
    )

    const companyIds = companies.map((c) => c.id)

    const contentSources = await checkAndSeed(client, 'content_sources', () =>
      seed.seedContentSources(client, companyIds),
    )
    const contentSourceIds = contentSources.map((cs) => cs.id)

    await checkAndSeed(client, 'company_employees', () =>
      seed.seedCompanyEmployees(client, companyIds, userIds),
    )

    await checkAndSeed(client, 'contacts', () => seed.seedContacts(client, companyIds, userIds))

    await checkAndSeed(client, 'newsletters', () =>
      seed.seedNewsletters(client, newsletterContentIds),
    )

    // 4. Seed content relationships
    await checkAndSeed(client, 'content_categories', () =>
      seed.seedContentCategories(client, allContentIds, categoryIds),
    )

    await checkAndSeed(client, 'content_tags', () =>
      seed.seedContentTags(
        client,
        allContentIds,
        tags.map((t) => t.id),
      ),
    )

    await checkAndSeed(client, 'news_tags', () =>
      seed.seedNewsTags(
        client,
        newsContentIds,
        tags.map((t) => t.id),
      ),
    )

    // 5. Seed addresses
    await checkAndSeed(client, 'addresses', () =>
      seed.seedAddresses(
        client,
        cities.map((c: any) => c.id),
        countries.map((c: any) => c.id),
        userIds,
        companyIds,
      ),
    )

    // 6. Seed news and research
    await checkAndSeed(client, 'news', () =>
      seed.seedNews(client, newsContentIds, companyIds, contentSourceIds),
    )

    await checkAndSeed(client, 'research', () => seed.seedResearch(client, researchContentIds))

    // 7. Seed user-related content
    const folders = await checkAndSeed(client, 'bookmark_folders', () =>
      seed.seedBookmarkFolders(client, userIds),
    )

    await checkAndSeed(client, 'bookmarks', () => seed.seedBookmarks(client, folders, contents))

    await checkAndSeed(client, 'content_source_visits', () =>
      seed.seedContentSourceVisits(client, userIds, newsContentIds),
    )

    await checkAndSeed(client, 'comments', () => seed.seedComments(client, allContentIds, userIds))

    await checkAndSeed(client, 'votes', () => seed.seedVotes(client, allContentIds, userIds))

    const features = await checkAndSeed(client, 'feature_requests', () =>
      seed.seedFeatureRequests(client),
    )

    await checkAndSeed(client, 'feature_rankings', () =>
      seed.seedFeatureRankings(
        client,
        userIds,
        features.map((f) => f.id),
      ),
    )

    // 8. Seed feedback and follows
    await checkAndSeed(client, 'feedbacks', () => seed.seedFeedback(client, userIds))

    await checkAndSeed(client, 'follows', () => seed.seedFollows(client, userIds, companyIds))

    // 9. Seed feeds and feed categories
    const feeds = await checkAndSeed(client, 'feeds', () => seed.seedFeeds(client, userIds))
    const feedIds = feeds.map((f) => f.id)

    await checkAndSeed(client, 'feed_categories', () =>
      seed.seedFeedCategories(
        client,
        feeds.map((f) => f.id),
        categoryIds,
      ),
    )

    await checkAndSeed(client, 'feed_sources', () =>
      seed.seedFeedSources(client, feedIds, contentSourceIds),
    )

    await checkAndSeed(client, 'error_logs', () => seed.seedErrorLogs(client, userIds))

    console.log(chalk.blue('✓ Database seeding completed successfully'))
    return true
  } catch (error) {
    console.error(chalk.red('Error during database seeding:'), error)
    return false
  }
}
