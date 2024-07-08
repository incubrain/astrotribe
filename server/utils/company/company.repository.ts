import { BaseRepository } from '../base.repository'
import type { SelectInput } from '../base.interface'
import { ICompanyRepository } from './company.interface'
import { Company } from './company.model'

export class CompanyRepository extends BaseRepository<Company> implements ICompanyRepository {
  constructor() {
    super({ loggerPrefix: 'CompanyRepository', Model: Company })
  }

  async selectCompanyById(config: SelectInput<{}, 'companies'>): Promise<Company> {
    this.log.info('selectCompanyById')

    const data = await this.selectOne<'companies'>({
      tableName: 'companies',
      selectStatement: `
        id,
        name,
        logo_url,
        url,
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

    this.log.info(`have data ${JSON.stringify(data)}`)
  }
}
