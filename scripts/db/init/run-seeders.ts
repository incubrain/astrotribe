import chalk from 'chalk'
import client from '../client'
import { checkAndSeed } from './utils'
import * as seed from './seeders'

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
      contents: 1115,
      companies: 400,
      news: 400,
      jobs: 100,
      research: 200,
      socialMedia: 100,
      categories: 20,
      newsletters: 15,
      referrers: 10,
      referralsPerReferrer: { min: 10, max: 50 },
      blockedIPs: { min: 5, max: 15 },
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
      seed.seedSocialMedia(client, companyIds),
    )

    const categories = await checkAndSeed(client, 'categories', () =>
      seed.seedCategories(client, config.counts.categories),
    )

    const tags = await checkAndSeed(client, 'tags', () => seed.seedTags(client, 100))

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
      seed.seedContentSources(client, 100),
    )
    const contentSourceIds = contentSources.map((cs) => cs.id)

    await checkAndSeed(client, 'company_employees', () =>
      seed.seedCompanyEmployees(client, companyIds, userIds),
    )

    await checkAndSeed(client, 'contacts', () => seed.seedContacts(client, companyIds))

    await checkAndSeed(client, 'newsletters', () =>
      seed.seedNewsletters(client, newsletterContentIds, companyIds),
    )

    // Seed ads and related data
    const adPackages = await checkAndSeed(client, 'ad_packages', () =>
      seed.seedAdPackages(client, 100),
    )

    const ads = await checkAndSeed(client, 'ads', () =>
      seed.seedAds(
        client,
        companyIds,
        adPackages.map((p) => p.id),
      ),
    )

    const adVariants = await checkAndSeed(client, 'ad_variants', () =>
      seed.seedAdVariants(
        client,
        ads.map((a) => a.id),
      ),
    )

    await checkAndSeed(client, 'ad_daily_metrics', () =>
      seed.seedAdDailyMetrics(
        client,
        adVariants.map((v) => v.id),
      ),
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
      ),
    )

    // 6. Seed news and research
    await checkAndSeed(client, 'news', () => seed.seedNews(client, newsContentIds, companyIds))

    await checkAndSeed(client, 'research', () =>
      seed.seedResearch(client, researchContentIds, companyIds),
    )

    // 7. Seed user-related content
    const folders = await checkAndSeed(client, 'bookmark_folders', () =>
      seed.seedBookmarkFolders(client, userIds),
    )

    const folderIds = folders.map((f) => f.id)

    await checkAndSeed(client, 'bookmarks', () =>
      seed.seedBookmarks(client, userIds, allContentIds, folderIds),
    )

    await checkAndSeed(client, 'content_source_visits', () =>
      seed.seedContentSourceVisits(client, contentSourceIds),
    )

    await checkAndSeed(client, 'comments', () => seed.seedComments(client, allContentIds, userIds))

    await checkAndSeed(client, 'votes', () => seed.seedVotes(client, allContentIds, userIds))

    const featureRequests = await checkAndSeed(client, 'feature_requests', () =>
      seed.seedFeatureRequests(client, userIds),
    )

    const featureRequestIds = featureRequests.map((f) => f.id)

    await checkAndSeed(client, 'feature_votes', () =>
      seed.seedFeatureVotes(client, userIds, featureRequestIds),
    )

    await checkAndSeed(client, 'jobs', () =>
      seed.seedJobs(client, allContentIds, companyIds, contentSourceIds, 100),
    )

    // 8. Seed feedback and follows
    await checkAndSeed(client, 'feedbacks', () => seed.seedFeedback(client, userIds))

    await checkAndSeed(client, 'follows', () => seed.seedFollows(client, userIds, companyIds))

    // 9. Seed feeds and feed categories
    const feeds = await checkAndSeed(client, 'feeds', () =>
      seed.seedFeeds(client, categoryIds, contentSourceIds),
    )
    const feedIds = feeds.map((f) => f.id)

    await checkAndSeed(client, 'feed_categories', () => seed.seedFeedCategories(client, 100))

    await checkAndSeed(client, 'feed_sources', () => seed.seedFeedSources(client, 100))

    await checkAndSeed(client, 'error_logs', () => seed.seedErrorLogs(client, 100))

    await client.query('ALTER TABLE referrals DISABLE TRIGGER refresh_referral_stats_trigger')
    await client.query('ALTER TABLE referrals DISABLE TRIGGER refresh_risk_metrics_trigger')

    // // Then seed referral records
    // const referrals = await checkAndSeed(client, 'referrals', () =>
    //   seed.seedReferrals(client, visitorIds),
    // )

    // Seed blocked IPs
    const blockedIPs = await checkAndSeed(client, 'blocked_ips', () =>
      seed.seedBlockedIPs(client, 10),
    )

    // Re-enable triggers
    await client.query('ALTER TABLE referrals ENABLE TRIGGER refresh_referral_stats_trigger')
    await client.query('ALTER TABLE referrals ENABLE TRIGGER refresh_risk_metrics_trigger')

    // Manually refresh materialized views once after all data is inserted
    await client.query('REFRESH MATERIALIZED VIEW referral_stats')
    await client.query('REFRESH MATERIALIZED VIEW referrer_risk_metrics')

    console.log(chalk.blue('✓ Database seeding completed successfully'))
    return true
  } catch (error: any) {
    console.error(chalk.red('Error during database seeding:'), error)
    try {
      await client.query('ALTER TABLE referrals ENABLE TRIGGER refresh_referral_stats_trigger')
      await client.query('ALTER TABLE referrals ENABLE TRIGGER refresh_risk_metrics_trigger')
    } catch (triggerError) {
      console.error(chalk.red('Error re-enabling triggers:'), triggerError)
      return false
    }
    return false
  }
}
