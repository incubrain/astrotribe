import { z } from 'zod'
import { datetimeOffset } from '../formatter'
import { addressSchema, Address } from '../address/address.model'
import { socialSchema, Social } from '../social/social.model'
import { contactSchema, Contact } from '../contact/contact.model'

const AccessLevelEnum = z.enum(['Viewer', 'Editor', 'Admin', 'Super Admin'])
const NewsRelationTypeEnum = z.enum(['Source', 'Topic', 'Mention'])
const NewsImportanceLevelEnum = z.enum(['High', 'Medium', 'Low'])

const companyEmployeesSchema = z.object({
  user_profile_id: z.string().uuid(),
  company_id: z.number().int(),
  role: z.string(),
  job_description: z.string().optional(),
  start_date: datetimeOffset().optional,
  end_date: datetimeOffset().optional,
  status: z.boolean(),
  access_level: AccessLevelEnum.default('Viewer'),
  created_at: datetimeOffset().optional,
  updated_at: datetimeOffset().optional
})

const companyNewsSchema = z.object({
  company_id: z.number().int(),
  news_id: z.number().int(),
  relation_type: NewsRelationTypeEnum,
  importance_level: NewsImportanceLevelEnum,
  created_at: datetimeOffset().optional,
  updated_at: datetimeOffset().optional
})

const ScrapeFrequencySchema = z.enum([
  'FourTimesDaily',
  'TwiceDaily',
  'Daily',
  'Weekly',
  'BiWeekly',
  'Monthly'
])

export const companySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  social_media_id: z.number().optional(),
  last_scraped_at: datetimeOffset().optional,
  scrape_frequency: ScrapeFrequencySchema.optional(),
  is_government: z.boolean().optional(),
  category_id: z.number().optional(),
  created_at: datetimeOffset().nullish,
  updated_at: datetimeOffset().nullish,
  addresses: z.array(addressSchema).optional(),
  social_media: socialSchema.optional(),
  contacts: z.array(contactSchema).optional(),
  employees: z.array(companyEmployeesSchema).optional(),
  news: z.array(companyNewsSchema).optional()
})

class CompanyEmployees {
  user_profile_id: string
  company_id: number
  role: string
  job_description?: string
  start_date: Date
  end_date?: Date
  status: boolean
  access_level: 'Viewer' | 'Editor' | 'Admin' | 'Super Admin'
  created_at: Date
  updated_at: Date

  constructor(data: any) {
    const parsedData = companyEmployeesSchema.parse(data)
    this.user_profile_id = parsedData.user_profile_id
    this.company_id = parsedData.company_id
    this.role = parsedData.role
    this.job_description = parsedData.job_description
    this.start_date = parsedData.start_date
    this.end_date = parsedData.end_date
    this.status = parsedData.status
    this.access_level = parsedData.access_level
    this.created_at = parsedData.created_at
    this.updated_at = parsedData.updated_at
  }
}

class CompanyNews {
  company_id: number
  news_id: number
  relation_type: 'Source' | 'Topic' | 'Mention'
  importance_level: 'High' | 'Medium' | 'Low'
  created_at: Date
  updated_at: Date

  constructor(data: any) {
    const parsedData = companyNewsSchema.parse(data)
    this.company_id = parsedData.company_id
    this.news_id = parsedData.news_id
    this.relation_type = parsedData.relation_type
    this.importance_level = parsedData.importance_level
    this.created_at = parsedData.created_at
    this.updated_at = parsedData.updated_at
  }
}

export class Company {
  id?: number
  name?: string
  description?: string
  logo_url?: string
  website_url?: string
  email?: string
  phone?: string
  social_media_id?: number
  last_scraped_at?: string
  scrape_frequency?: 'FourTimesDaily' | 'TwiceDaily' | 'Daily' | 'Weekly' | 'BiWeekly' | 'Monthly'
  is_government?: boolean
  category_id?: number
  created_at?: string
  updated_at?: string
  addresses?: Address[]
  social_media?: Social
  contacts?: Contact[]
  employees?: CompanyEmployees[]
  news?: CompanyNews[]

  constructor(data: any) {
    const parsedData = companySchema.parse(data)
    this.id = parsedData.id ?? undefined
    this.name = parsedData.name ?? undefined
    this.description = parsedData.description ?? undefined
    this.logo_url = parsedData.logo_url ?? undefined
    this.website_url = parsedData.website_url ?? undefined
    this.email = parsedData.email ?? undefined
    this.phone = parsedData.phone ?? undefined
    this.social_media_id = parsedData.social_media_id ?? undefined
    this.last_scraped_at = parsedData.last_scraped_at ?? undefined
    this.scrape_frequency = parsedData.scrape_frequency ?? undefined
    this.is_government = parsedData.is_government ?? undefined
    this.category_id = parsedData.category_id ?? undefined
    this.created_at = parsedData.created_at ?? undefined
    this.updated_at = parsedData.updated_at ?? undefined
    this.social_media = parsedData.social_media ? new Social(parsedData.social_media) : undefined
    this.addresses = parsedData.addresses ? parsedData.addresses.map((address: any) => new Address(address)) : undefined
    this.contacts = parsedData.contacts
      ? parsedData.contacts.map((contact: any) => new Contact(contact))
      : undefined
    this.employees = parsedData.employees
      ? parsedData.employees.map((employee: any) => new CompanyEmployees(employee))
      : undefined
    this.news = parsedData.news
      ? parsedData.news.map((news: any) => new CompanyNews(news))
      : undefined
  }
}
