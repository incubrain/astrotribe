import { z, ZodError } from 'zod'
import { datetimeOffset } from '../formatter'
import { addressSchema, Address } from '../address/address.model'
import { socialSchema, Social } from '../social/social.model'
import { contactSchema, Contact } from '../contact/contact.model'

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
  contacts: z.array(contactSchema).optional()
})

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
  addresses?: any[]
  social_media?: any
  contacts?: Contact[]

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
    this.addresses = parsedData.addresses
    this.social_media = parsedData.social_media
    this.contacts = parsedData.contacts
      ? parsedData.contacts.map((contact: any) => new Contact(contact))
      : undefined
  }
}
