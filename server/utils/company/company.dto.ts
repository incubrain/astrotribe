import { z } from 'zod'
import { BaseDTO } from '../base.dto'
import { companySchema } from './company.model'

export type CompanyDTOKey = 'select:company:card'

const pickCompanyCard = {
  id: true,
  name: true,
  description: true,
  logo_url: true,
  website_url: true,
  blog_url: true,
  jobs_page_url: true,
  events_page_url: true,
  sector: true,
  category_id: true,
  last_scraped_at: true,
  scrape_frequency: true
} as const

const companyCardSchema = companySchema.pick(pickCompanyCard).extend({
  author: z.string().nullable()
})

type CompanyDTOSchema = z.infer<typeof companyCardSchema>

export class CompanyDTO extends BaseDTO<CompanyDTOSchema> {
  constructor() {
    super([
      {
        name: 'select:company:card',
        schema: companyCardSchema,
        select: generateSelectStatement(pickCompanyCard)
      }
    ])
  }
}
