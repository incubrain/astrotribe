import { z } from 'zod'

export const HostSchema = z.object({
  id: z.string(),
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

export type VenueType = z.infer<typeof VenueSchema>
export type LocationType = z.infer<typeof LocationSchema>
export type EventHostType = z.infer<typeof HostSchema>
export type EventType = z.infer<typeof EventSchema>
