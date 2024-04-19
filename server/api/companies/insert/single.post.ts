import { CompanyService } from '~/server/utils/company/company.service'

export default defineEventHandler(async (event) => {
  const { newData, dto } = await readBody(event)

  // logic:med:med:2 - set the dataTypes and call correct function. eg. settings or profile
  // consider if this is worthwhile, or we should have individual endpoints per dataType
  console.log('insert company', newData, dto)

  console.log('insert company', newData.name, dto)
  try {
    const companyService = new CompanyService()
    const validatedCompany = companyService.validateCompanyWithDetails(newData)
    const insertedCompany = await companyService.createCompanyWithDetails(validatedCompany)

    // if (!company || !company.id) {
    //   console.error('Error Inserting Company')
    //   return {
    //     status: 404,
    //     message: 'Company not added',
    //     companys: null
    //   }
    // }

    return {
      status: 200,
      message: 'Company added',
      data: insertedCompany
    }
  } catch (error: any) {
    console.error('insert-single-company error', error.message)
    return {
      status: 500,
      message: error.message,
      data: null
    }
  }
})
