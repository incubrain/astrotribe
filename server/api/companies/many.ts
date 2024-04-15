import { CompanyRepository } from '~/server/utils/company/company.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  console.log('get company', query)

  if (!Array.isArray(query.filters)) {
    console.log('filters is not array')
    query.filters = [JSON.parse(query.filters)]
  }

  if (query.pagination) {
    console.log('pagination is not array')
    query.pagination = JSON.parse(query.pagination)
  }

  try {
    const client = new CompanyRepository()
    const company = await client.selectCompanyCards(query)

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
