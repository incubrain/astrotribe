import { z } from 'zod'

export const HostBasicValidation = z.object({
  id: z.number(),
  given_name: z.string(),
  avatar: z.string()
})

export const LocationValidation = z.object({
  id: z.number(),
  created_at: z.string().optional(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  address: z.string().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable()
})

export const VenueValidation = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string(),
  body: z.string(),
  website: z.string(),
  featured_image: z.string(),
  logo: z.string(),
  events_hosted: z.number().nullable().optional(),
  bortle_rating: z.number(),
  location: LocationValidation
})

export const EventBasicValidation = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string().nullable(),
  date: z.string(),
  venue: VenueValidation
})

export const EventFullValidation = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  featured_image: z.string().nullable(),
  hosts: z.array(HostBasicValidation),
  venue: VenueValidation.optional()
})

export type Venue = z.infer<typeof VenueValidation>
export type Location = z.infer<typeof LocationValidation>
export type Host = z.infer<typeof HostBasicValidation>
export type Event = z.infer<typeof EventBasicValidation>
export type EventFull = z.infer<typeof EventFullValidation>
