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

export const VenueBasicValidation = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string(),
  logo: z.string().nullable(),
  location: LocationValidation
})

export const VenueEventsValidation = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasicValidation)
})

export const VenueFullValidation = z.object({
  id: z.number(),
  bortle_rating: z.number().nullable(),
  created_at: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string(),
  logo: z.string().nullable(),
  events_hosted: z.number().nullable().optional(),
  avg_rating: z.number().nullable().optional(),
  location: LocationValidation,
  events: z.array(VenueEventsValidation)
})

export const EventBasicValidation = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasicValidation),
  venue: VenueBasicValidation
})

export const EventFullValidation = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasicValidation),
  venue: VenueFullValidation.optional()
})
