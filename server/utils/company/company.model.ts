import { z } from 'zod'

export const SocialMediaSchema = z.object({
  id: z.number().optional(),
  facebook_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  instagram_url: z.string().url().optional()
})

export const CountrySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1)
})

export const CitySchema = z.object({
  id: z.number().optional(), // Optional for creation
  name: z.string().min(1),
  country_id: z.number()
})

export const AddressSchema = z.object({
  id: z.number().optional(), // Optional for creation
  street1: z.string().min(1),
  street2: z.string().optional(),
  city_id: z.number(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country_id: z.number()
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
  name: z.string().min(1),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address_id: z.number(),
  social_media_id: z.number().optional(),
  jobs_page_url: z.string().url().optional(),
  events_page_url: z.string().url().optional(),
  blog_url: z.string().url().optional(),
  last_scraped_at: z.date().optional(),
  scrape_frequency: ScrapeFrequencySchema,
  sector: z.enum(['private', 'government']),
  category_id: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
})

export class Company {
  id: number
  name: string
  description: string
  logo_url: string
  website_url: string
  email: string
  phone: string
  address_id: number
  social_media_id: number
  jobs_page_url: string
  events_page_url: string
  blog_url: string
  last_scraped_at: Date
  scrape_frequency: 'FourTimesDaily' | 'TwiceDaily' | 'Daily' | 'Weekly' | 'BiWeekly' | 'Monthly'
  sector: 'private' | 'government'
  category_id: number
  created_at: Date
  updated_at: Date

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.logo_url = data.logo_url
    this.website_url = data.website_url
    this.email = data.email
    this.phone = data.phone
    this.address_id = data.address_id
    this.social_media_id = data.social_media_id
    this.jobs_page_url = data.jobs_page_url
    this.events_page_url = data.events_page_url
    this.blog_url = data.blog_url
    this.last_scraped_at = data.last_scraped_at
    this.scrape_frequency = data.scrape_frequency
    this.sector = data.sector
    this.category_id = data.category_id
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }
}
