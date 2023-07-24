import { z } from 'zod'

export const HostSchema = z.object({
  id: z.number(),
  given_name: z.string(),
  avatar: z.string()
})

export const LocationSchema = z.object({
  id: z.number(),
  created_at: z.string().optional(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  address: z.string().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable()
})

export const VenueSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string(),
  body: z.string(),
  website: z.string(),
  featured_image: z.string(),
  logo: z.string(),
  events_hosted: z.number().nullable().optional(),
  bortle_rating: z.number(),
  location: LocationSchema
})

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  featured_image: z.string(),
  date: z.string(),
  venue: VenueSchema,
  hosts: z.array(HostSchema)
})

export type Venue = z.infer<typeof VenueSchema>
export type Location = z.infer<typeof LocationSchema>
export type Host = z.infer<typeof HostSchema>
export type Event = z.infer<typeof EventSchema>
