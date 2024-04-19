import { z } from 'zod'
import { BaseDTO } from '../base.dto'
import { datetimeOffset } from '../formatter'
import { companySchema } from './company.model'

export type CompanyDTOKey = 'select:company:card'

const pickCompanyCard = {
  id: true,
  name: true,
  description: true,
  logo_url: true,
  website_url: true,
  is_government: true,
  category_id: true,
  last_scraped_at: true,
  scrape_frequency: true,
  addresses: true,
  social_media: true,
  contacts: true
} as const

const companyCardSchema = companySchema.pick(pickCompanyCard).extend({
  last_scraped_at: datetimeOffset().optional
})
// extend when needed

type CompanyDTOSchema = z.infer<typeof companyCardSchema>

export class CompanyDTO extends BaseDTO<CompanyDTOSchema> {
  constructor() {
    super([
      {
        name: 'select:company:card',
        schema: companyCardSchema
      }
    ])
  }
}
