import chalk from 'chalk'
import client from '../client'
import { checkAndSeed, getSeedingErrors, clearSeedingErrors } from './utils'
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
    astronomyEvents: number
    businessDomains: number
    contentTypes: number
  }
}

export async function runSeeders() {
  console.log(chalk.blue('Starting database seeding...'))
  clearSeedingErrors()

  const config = {
    batchSize: 100,
    counts: {
      contents: 50, // Reduced to minimize database load
      companies: 100, // Reduced to minimize database load
      news: 50,
      jobs: 50,
      research: 50,
      socialMedia: 50,
      categories: 20,
      newsletters: 15,
      referrers: 10,
      referralsPerReferrer: { min: 5, max: 20 },
      blockedIPs: { min: 5, max: 10 },
      astronomyEvents: 30,
      businessDomains: 20,
      contentTypes: 7, // Fixed number of content types
      blacklistedDomains: 20,
      blacklistedURLs: 30,
      categorizedURLs: 50,
      companyContacts: 30,
      companyExtras: 50,
      companyMetrics: 100,
      contentInteractions: 100,
    },
  }

  try {
    // Get list of existing users from the fixed user_profiles table
    const { rows: users } = await client.query('SELECT id FROM user_profiles')
    const userIds = users.map((u) => u.id)
    if (userIds.length === 0) {
      throw new Error(
        'No users found in user_profiles table. Please ensure user_profiles table is populated before running seeders.',
      )
    }

    await checkAndSeed(client, 'user_metrics', () => seed.seedUserMetrics(client, userIds))

    // 1. Seed reference data and system tables first (no dependencies)
    const countries = await checkAndSeed(client, 'countries', () => seed.seedCountries(client))

    const cities = await checkAndSeed(client, 'cities', () => seed.seedCities(client))

    // Seed astronomy events (no dependencies)
    await checkAndSeed(client, 'astronomy_events', () =>
      seed.seedAstronomyEvents(client, config.counts.astronomyEvents),
    )

    // Seed content types (no dependencies)
    await checkAndSeed(client, 'content_types', () => seed.seedContentTypes(client))

    const categories = await checkAndSeed(client, 'categories', () =>
      seed.seedCategories(client, config.counts.categories),
    )

    const tags = await checkAndSeed(client, 'tags', () => seed.seedTags(client, 50))

    const categoryIds = categories.map((c) => c.id)

    // 2. Seed business domains (business_domains has self-referential relationship)
    const businessDomains = await checkAndSeed(client, 'business_domains', () =>
      seed.seedBusinessDomains(client, config.counts.businessDomains),
    )

    const businessDomainIds = businessDomains.map((d) => d.id)

    // 3. Seed content and related tables
    const contents = await checkAndSeed(client, 'contents', () =>
      seed.seedContents(client, config.counts.contents),
    )

    const allContentIds = contents.map((c) => c.id)

    // Filter contents by type
    const newsletterContentIds = contents
      .filter((c) => c.content_type === 'newsletters')
      .map((c) => c.id)

    // 4. Seed security-related tables with no dependencies
    const blacklistedDomains = await checkAndSeed(client, 'blacklisted_domains', () =>
      seed.seedBlacklistedDomains(client, config.counts.blacklistedDomains),
    )

    // 5. First seed social media before companies
    const socialMedia = await checkAndSeed(client, 'social_media', () =>
      seed.seedSocialMedia(client, config.counts.socialMedia),
    )

    // Then seed companies which depend on social_media
    const companies = await checkAndSeed(client, 'companies', () =>
      seed.seedCompanies(client, config.counts.companies),
    )

    const companyIds = companies.map((c) => c.id)

    // Now seed blacklisted URLs which depend on companies
    await checkAndSeed(client, 'blacklisted_urls', () =>
      seed.seedBlacklistedURLs(client, companyIds, config.counts.blacklistedURLs),
    )

    // Seed categorized URLs which depend on companies and business domains
    await checkAndSeed(client, 'categorized_urls', () =>
      seed.seedCategorizedURLs(
        client,
        companyIds,
        businessDomainIds,
        config.counts.categorizedURLs,
      ),
    )

    const contentSources = await checkAndSeed(client, 'content_sources', () =>
      seed.seedContentSources(client, 50),
    )
    const contentSourceIds = contentSources.map((cs) => cs.id)

    // 6. Seed company related details
    await checkAndSeed(client, 'company_employees', () =>
      seed.seedCompanyEmployees(client, companyIds, userIds),
    )

    const contacts = await checkAndSeed(client, 'contacts', () =>
      seed.seedContacts(client, userIds),
    )

    const contactIds = contacts.map((c) => c.id)

    // Seed company contacts which depend on companies and contacts
    await checkAndSeed(client, 'company_contacts', () =>
      seed.seedCompanyContacts(client, companyIds, contactIds, config.counts.companyContacts),
    )

    // Seed company extras which depend on companies
    await checkAndSeed(client, 'company_extras', () =>
      seed.seedCompanyExtras(client, companyIds, config.counts.companyExtras),
    )

    // 7. Seed metric data
    // Create dummy metric definition IDs since we don't have a seeder for them
    const dummyMetricDefinitionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    await checkAndSeed(client, 'company_metrics', () =>
      seed.seedCompanyMetrics(
        client,
        companyIds,
        dummyMetricDefinitionIds,
        config.counts.companyMetrics,
      ),
    )

    await checkAndSeed(client, 'newsletters', () =>
      seed.seedNewsletters(client, newsletterContentIds, companyIds),
    )

    // 8. Seed ads and related data
    const adPackages = await checkAndSeed(client, 'ad_packages', () =>
      seed.seedAdPackages(client, 20),
    )

    // Make sure we have the ads seeded before ad variants
    const ads = await checkAndSeed(client, 'ads', () =>
      seed.seedAds(
        client,
        companyIds,
        adPackages.map((p) => p.id),
      ),
    )

    // Seed ad-related tables
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

    await checkAndSeed(client, 'jobs', () => seed.seedJobs(client, companyIds, config.counts.jobs))

    await checkAndSeed(client, 'follows', () => seed.seedFollows(client, userIds, companyIds))

    // 9. Seed content relationships
    await checkAndSeed(client, 'content_tags', () =>
      seed.seedContentTags(
        client,
        allContentIds,
        tags.map((t) => t.id),
      ),
    )

    // 10. Seed content interactions
    await checkAndSeed(client, 'content_interactions', () =>
      seed.seedContentInteractions(
        client,
        allContentIds,
        userIds,
        config.counts.contentInteractions,
      ),
    )

    // 11. Seed addresses
    await checkAndSeed(client, 'addresses', () =>
      seed.seedAddresses(
        client,
        cities.map((c: any) => c.id),
        countries.map((c: any) => c.id),
        companyIds,
        userIds,
      ),
    )

    // 12. Seed user-related content
    const folders = await checkAndSeed(client, 'bookmark_folders', () =>
      seed.seedBookmarkFolders(client, userIds),
    )

    const folderIds = folders.map((f) => f.id)

    await checkAndSeed(client, 'bookmarks', () =>
      seed.seedBookmarks(client, userIds, allContentIds),
    )

    await checkAndSeed(client, 'comments', () => seed.seedComments(client, userIds, allContentIds))

    await checkAndSeed(client, 'votes', () => seed.seedVotes(client, userIds, allContentIds))

    // 13. Seed feature requests and votes
    const featureRequests = await checkAndSeed(client, 'feature_requests', () =>
      seed.seedFeatureRequests(client),
    )

    const featureRequestIds = featureRequests.map((f) => f.id)

    await checkAndSeed(client, 'feature_votes', () =>
      seed.seedFeatureVotes(client, userIds, featureRequestIds),
    )

    // 14. Seed feeds and feed categories
    const feeds = await checkAndSeed(client, 'feeds', () => seed.seedFeeds(client, userIds))

    const feedIds = feeds.map((f) => f.id)

    await checkAndSeed(client, 'feed_categories', () =>
      seed.seedFeedCategories(client, feedIds, categoryIds),
    )

    await checkAndSeed(client, 'feed_sources', () =>
      seed.seedFeedSources(client, feedIds, contentSourceIds),
    )

    await checkAndSeed(client, 'error_logs', () => seed.seedErrorLogs(client, 50))

    // Try to disable triggers - use standard syntax without IF EXISTS (not supported in older PG versions)
    try {
      await client.query('ALTER TABLE referrals DISABLE TRIGGER ALL')
    } catch (triggerError) {
      console.warn(
        chalk.yellow('Could not disable triggers on referrals table (table might not exist)'),
      )
    }

    // Seed blocked IPs
    const blockedIPs = await checkAndSeed(client, 'blocked_ips', () =>
      seed.seedBlockedIPs(client, config.counts.blockedIPs.min),
    )

    // Try to re-enable triggers
    try {
      await client.query('ALTER TABLE referrals ENABLE TRIGGER ALL')
    } catch (triggerError) {
      console.warn(
        chalk.yellow('Could not re-enable triggers on referrals table (table might not exist)'),
      )
    }

    // Try to refresh materialized views
    try {
      // First check if views exist before trying to refresh them
      const { rows: matViewsResult } = await client.query(`
        SELECT relname 
        FROM pg_class 
        WHERE relkind = 'm' 
        AND relname = 'referral_stats'
      `)

      if (matViewsResult.length > 0) {
        await client.query('REFRESH MATERIALIZED VIEW referral_stats')
      }

      const { rows: riskViewsResult } = await client.query(`
        SELECT relname 
        FROM pg_class 
        WHERE relkind = 'm' 
        AND relname = 'referrer_risk_metrics'
      `)

      if (riskViewsResult.length > 0) {
        await client.query('REFRESH MATERIALIZED VIEW referrer_risk_metrics')
      }
    } catch (viewError) {
      console.warn(chalk.yellow('Could not refresh materialized views:'), viewError)
    }

    // Report any seeding errors
    const errors = getSeedingErrors()
    if (errors.length > 0) {
      console.log(chalk.yellow('\nSeeding completed with errors in the following tables:'))
      errors.forEach(({ table, error }) => {
        console.log(chalk.red(`\n${table}:`))
        console.log(chalk.red(error.message))
      })
      return false
    }

    console.log(chalk.green('\n✓ Database seeding completed successfully'))
    return true
  } catch (error: any) {
    console.error(chalk.red('Error during database seeding:'), error)
    try {
      // Try to re-enable triggers
      await client.query('ALTER TABLE referrals ENABLE TRIGGER ALL')
    } catch (triggerError) {
      console.warn(chalk.yellow('Could not re-enable triggers on referrals table'))
    }
    return false
  }
}
