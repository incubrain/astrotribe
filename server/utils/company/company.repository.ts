import { BaseRepository } from '../base.repository'
import type { FuncConfig, UpsertInput } from '../base.interface'
import { ICompanyRepository } from './company.interface'
import { Company } from './company.model'
import { CompanyDTO } from './company.dto'

export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  dto = new CompanyDTO()
  constructor() {
    super({ loggerPrefix: 'CompanyRepository', tableName: 'companies' })
  }

  async selectCompanyCards(config: FuncConfig<{}>): Promise<Company[] | Company> {
    this.logger.info('selectCompanyCards')

    return await this.select({
      operation: 'select',
      criteria: {
        select: this.dto.getSelect(config.dto),
        ...config
      }
    }).then((data) =>
      data.map((company) =>
        this.dto.validateAndFormatData({ data: new Company(company), dto: config.dto })
      )
    )
  }

  async insertCompany(config: UpsertInput<Company>): Promise<void> {
    const companyData: any = config.data
    // Start a transaction
    await this.clientQueryAdmin(async (client) => {
      const { data: company, error: companyError } = await client.from('companies').insert([
        {
          name: companyData.name,
          description: companyData.description,
          founding_year: companyData.founding_year,
          logo_url: companyData.logo_url,
          website_url: companyData.website_url,
          blog_url: companyData.blog_url,
          jobs_page_url: companyData.jobs_page_url,
          is_government: companyData.is_government,
          category_id: companyData.category_id,
          last_scraped_at: companyData.last_scraped_at,
          scrape_frequency: companyData.scrape_frequency
        }
      ])

      if (companyError) {
        console.error('Error inserting company:', companyError)
        return
      }

      // Assuming company is successfully inserted, and you receive back the ID
      console.log('Company inserted:', company, companyError)
      const companyId = company[0].id

      // Insert addresses linked to the company
      const addressesWithCompanyId = companyData.addresses.map((address) => ({
        ...address,
        company_id: companyId
      }))

      await client.from('addresses').insert(addressesWithCompanyId)

      // Insert contacts linked to the company
      const contactsWithCompanyId = companyData.contacts.map((contact) => ({
        ...contact,
        company_id: companyId
      }))

      await client.from('contacts').insert(contactsWithCompanyId)

      // Insert social media info linked to the company
      if (companyData.social_media) {
        const socialMediaData = {
          ...companyData.social_media,
          company_id: companyId
        }

        await client.from('social_media').insert([socialMediaData])
      }
    })
  }
}
