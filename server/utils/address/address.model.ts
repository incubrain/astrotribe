import { z, ZodError } from 'zod'
import { datetimeOffset } from '../formatter'

export const countrySchema = z.object({
  id: z.number().optional(),
  name: z.string()
})

const countryInsertSchema = countrySchema.omit({ id: true })
const countryUpdateSchema = countrySchema.partial()

export const citySchema = z.object({
  id: z.number().optional(),
  country_id: z.number().optional(),
  name: z.string().optional(),
  state: z.string().nullable(),
  country: countrySchema.nullish()
})

const cityInsertSchema = citySchema.omit({ id: true })
const cityUpdateSchema = citySchema.partial()

const addressTypeEnum = z.enum(['Residential', 'Headquarters', 'Office', 'Factory', 'Lab'])
export const addressSchema = z.object({
  id: z.number().optional(),
  created_at: datetimeOffset().optional,
  updated_at: datetimeOffset().optional,
  name: z.string().nullable(),
  address_type: addressTypeEnum.nullable(),
  street1: z.string().optional(),
  street2: z.string().nullable(),
  is_primary: z.boolean().nullable(),
  city_id: z.number(),
  company_id: z.number().nullable(),
  country_id: z.number(),
  user_id: z.string().nullable(),
  country: countrySchema.nullish(),
  city: citySchema.nullish()
})

const addressInsertSchema = addressSchema.omit({ id: true }).partial()
const addressUpdateSchema = addressInsertSchema

type AddressTypeEnum = z.infer<typeof addressTypeEnum>
type AddressRow = z.infer<typeof addressSchema>
type CountryRow = z.infer<typeof countrySchema>
type CityRow = z.infer<typeof citySchema>

export class Country {
  id?: number | null
  name?: string

  constructor(data: Partial<Country>) {
    this.name = data.name
    this.id = data.id ?? null
  }
}

export class City {
  id?: number | null
  country_id?: number
  name?: string
  state?: string | null
  country?: Country | null

  constructor(data: Partial<City>) {
    this.country_id = data.country_id
    this.name = data.name
    this.id = data.id ?? null
    this.state = data.state ?? null
    this.country = data.country ? new Country(data.country) : null
  }
}

export class Address {
  id: number | null
  created_at: string | null
  updated_at: string | null
  address_type: AddressTypeEnum | null
  is_primary: boolean | null
  name: string | null
  street1: string
  street2: string | null
  user_id: string | null
  city_id: number
  company_id: number | null
  country_id: number
  country?: Country | null
  city?: City | null

  constructor(data: Partial<Address>) {
    this.id = data.id ?? null
    this.name = data.name ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.created_at ?? null
    this.address_type = data.address_type ?? null
    this.street1 = data.street1
    this.street2 = data.street2 ?? null
    this.is_primary = data.is_primary ?? null
    this.company_id = data.company_id ?? null
    this.user_id = data.user_id ?? null
    this.city_id = data.city_id
    this.country_id = data.country_id
    this.country = data.country ? new Country(data.country) : null
    this.city = data.city ? new City(data.city) : null
  }
}
