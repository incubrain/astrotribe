import { CompanyRepository } from '~/server/utils/company/company.repository'

export default defineEventHandler(async (event) => {
  console.log('get company')
  const query = getQuery(event)

  const parsedQuery = handleQueryParams(query)

  try {
    const companyRepository = new CompanyRepository()
    const company = await companyRepository.selectCompanyById({
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
      filterBy: { columnName: 'id', operator: 'eq', value: parsedQuery.id }
    })

    return {
      status: 200,
      message: 'Company retrieved from supabase',
      data: company
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
