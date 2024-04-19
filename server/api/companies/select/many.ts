import { CompanyRepository } from '~/server/utils/company/company.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const parsedQuery = handleQueryParams(query)

  try {
    const companyRepository = new CompanyRepository()
    const companies = await companyRepository.selectCompanyCards({
      tableName: 'companies',
      selectStatement: `
      id,
      name,
      logo_url,
      website_url,
      is_government,
      category_id,
      last_scraped_at,
      scrape_frequency,
      description,
      addresses(*),
      social_media(*)
      contacts(*)`,
      filterBy: parsedQuery.filterBy,
      pagination: parsedQuery.pagination
    })

    console.log('api companies', companies)
    return {
      status: 200,
      message: 'Company retrieved from supabase',
      data: companyRepository.dto.validateAndFormatData({ data: companies, dto: parsedQuery.dto })
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
