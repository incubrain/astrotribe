import { z } from 'zod'
import { datetimeOffset, companySchema, CompanyRepository, socialSchema } from '#imports'

const pickCompanyCard = {
  id: true,
  name: true,
  description: true,
  logo_url: true,
  website_url: true,
  is_government: true,
  founding_year: true,
  category_id: true,
  last_scraped_at: true,
  scrape_frequency: true
} as const

const companyCardSchema = z.array(
  companySchema.pick(pickCompanyCard).extend({
    last_scraped_at: datetimeOffset().optional,
    social_media: socialSchema
      .pick({
        facebook_url: true,
        twitter_url: true,
        linkedin_url: true,
        instagram_url: true,
        youtube_url: true
      })
      .optional()
  })
)

export default defineEventHandler(async (event) => {
  logger.child({ loggerPrefix: 'company/select/cards' })
  const query = getQuery(event)

  const parsedQuery = handleQueryParams(query)

  try {
    const companyRepository = new CompanyRepository()
    const companies = await companyRepository.selectMany<'companies'>({
      tableName: 'companies',
      selectStatement: `
      id,
      created_at,
      name,
      logo_url,
      website_url,
      is_government,
      founding_year,
      category_id,
      last_scraped_at,
      scrape_frequency,
      description,
      social_media(facebook_url, twitter_url, linkedin_url, instagram_url, youtube_url)
      `,
      filterBy: parsedQuery.filterBy,
      orderBy: {
        columnNames: ['name'],
        ascending: true
      },
      pagination: parsedQuery.pagination
    })

    logger.debug(`company structure ${JSON.stringify(companies[0])}`)

    return {
      status: 200,
      message: 'Company retrieved from supabase',
      data: companyCardSchema.parse(companies)
    }
  } catch (error: any) {
    console.error('get-company error', error.message)
    return {
      status: 500,
      message: 'Error retrieving company',
      data: null,
      error
    }
  }
})
