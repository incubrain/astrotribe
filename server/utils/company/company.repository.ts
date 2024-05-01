import { BaseRepository } from '../base.repository'
import type { SelectInput } from '../base.interface'
import { ICompanyRepository } from './company.interface'
import { Company } from './company.model'
import { CompanyDTO } from './company.dto'

export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  dto = new CompanyDTO()
  constructor() {
    super({ loggerPrefix: 'CompanyRepository', Model: Company })
  }

  async selectCompanyCards(input: SelectInput<{}>): Promise<Company[]> {
    this.logger.info('selectCompanyCards')

    const data = await this.selectMany<'companies'>(input)

    this.logger.info(`have data ${JSON.stringify(data)}`)
    return data.map((company) => new Company(company))
  }

  async selectCompanyById(config: SelectInput<{}>): Promise<Company> {
    this.logger.info('selectCompanyById')

    const data = await this.selectOne<'companies'>({
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
        contacts(*)
        `,
      filterBy: config.filterBy
    })

    this.logger.info(`have data ${JSON.stringify(data)}`)
    return this.dto.validateAndFormatData({ data: new Company(data), dto: config.dto })
  }
}
