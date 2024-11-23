import chalk from 'chalk'
import client from '../client'
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

  const config: SeedConfig = {
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
    // Get list of existing users from user_profiles
    const { rows: users } = await client.query('SELECT id FROM user_profiles')
    const userIds = users.map((u) => u.id)
    if (userIds.length === 0) {
      throw new Error('No users found in user_profiles table')
    }

    // 1. Seed reference data first
    const countries = await seed.seedCountries(client)
    const cities = await seed.seedCities(client)
    const socialMedia = await seed.seedSocialMedia(client, config.counts.socialMedia)
    const categories = await seed.seedCategories(client, config.counts.categories)
    const tags = await seed.seedTags(client)

    const categoryIds = categories.map((c) => c.id)

    // 2. Seed content and related tables
    const contents = await seed.seedContents(client, config.counts.contents)
    const allContentIds = contents.map((c) => c.id)

    // Filter contents by type
    const companyContentIds = contents
      .filter((c) => c.content_type === 'companies')
      .map((c) => c.id)
    const newsContentIds = contents.filter((c) => c.content_type === 'news').map((c) => c.id)
    const researchContentIds = contents
      .filter((c) => c.content_type === 'research')
      .map((c) => c.id)
    const newsletterContentIds = contents
      .filter((c) => c.content_type === 'newsletters')
      .map((c) => c.id)

    // 3. Seed companies and related data
    const companies = await seed.seedCompanies(client, companyContentIds)
    const companyIds = companies.map((c) => c.id)
    await seed.seedContentSources(client, companyIds)
    await seed.seedCompanyEmployees(client, companyIds, userIds)
    await seed.seedContacts(client, companyIds, userIds)
    await seed.seedNewsletters(client, newsletterContentIds)

    // Seed content related data
    await seed.seedContentCategories(
      client,
      allContentIds,
      categories.map((c) => c.id),
    )

    await seed.seedContentTags(
      client,
      allContentIds,
      tags.map((t) => t.id),
    )

    await seed.seedNewsTags(
      client,
      newsContentIds,
      tags.map((t) => t.id),
    )

    // 4. Seed addresses
    await seed.seedAddresses(
      client,
      cities.map((c: any) => c.id),
      countries.map((c: any) => c.id),
      userIds,
      companyIds,
    )

    // 5. Seed news and research
    await seed.seedNews(client, newsContentIds, companyIds)
    await seed.seedResearch(client, researchContentIds)

    // 6. Seed user-related content
    const folders = await seed.seedBookmarkFolders(client, userIds)
    await seed.seedBookmarks(
      client,
      folders.map((f) => f.id),
      contents.map((c) => c.id),
      userIds,
    )
    await seed.seedComments(
      client,
      contents.map((c) => c.id),
      userIds,
    )
    await seed.seedVotes(
      client,
      contents.map((c) => c.id),
      userIds,
    )

    // 7. Seed feedback and follows
    await seed.seedFeedback(client, userIds)
    await seed.seedFollows(client, userIds, companyContentIds)

    // 8 Seed Feeds and Feed Categories
    // After feeds seeding:
    const feeds = await seed.seedFeeds(client, userIds)
    await seed.seedFeedCategories(
      client,
      feeds.map((f) => f.id),
      categoryIds,
    )

    console.log(chalk.blue('✓ Database seeding completed successfully'))
    return true
  } catch (error) {
    console.error(chalk.red('Error during database seeding:'), error)
    return false
  }
}
