import * as z from 'zod'

export const Page = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  slug: z.string()
})

export const PageWithChildren = Page.extend({
  children: z.array(Page).optional()
})

export const Role = z.object({
  id: z.number(),
  name: z.string().nullable(),
  body: z.string().nullable().optional(),
  created_at: z.string().optional()
})

export const IdName = z.object({
  id: z.number(),
  name: z.string()
})

export const HostBasic = z.object({
  id: z.number(),
  given_name: z.string(),
  avatar: z.string()
})

export const VenueBasic = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string(),
  logo: z.string().nullable(),
  location: z.object({
    city: z.string(),
    country: z.string(),
    address: z.string().nullable(),
    state: z.string()
  })
})

export const Skill = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable().optional(),
  total_endorsements: z.number(),
  admin_rating: z.number().nullable(),
  avg_rating: z.number().nullable(),
  created_at: z.string().optional()
})

export const Language = z.object({
  id: z.number(),
  name: z.string(),
  iso_639_1: z.string().optional(),
  iso_639_2: z.string().optional()
})

export const Location = z.object({
  id: z.number(),
  created_at: z.string().optional(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  address: z.string().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable()
})

export const UserLocation = Location.extend({
  from: z.string().optional(),
  to: z.string().optional(),
  is_home: z.boolean()
})

export const Socials = z.object({
  id: z.number(),
  url: z.string(),
  platform: z.string(),
  username: z.string().nullable()
})

export const Post = z.object({
  id: z.number(),
  created_at: z.string().nullable(),
  user_id: z.string().nullable(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  image: z.string().nullable(),
  status_id: z.number()
})

export const News = z.object({
  title: z.string().nullable(),
  body: z.string().nullable(),
  author: z.string().nullable(),
  published: z.string().nullable(),
  category: z.string().nullable()
})

export const UserBasic = z.object({
  id: z.number(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  avatar: z.string().nullable(),
  introduction: z.string().nullable(),
  follow_count: z.number().nullable(),
  followed_count: z.number().nullable(),
  is_following: z.boolean().nullable(),
  main_role: IdName,
  user_roles: z.array(Role),
  last_seen: z.string()
})

export const UserFull = UserBasic.extend({
  email: z.string(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  cover_image: z.string().nullable(),
  quote: z.string().nullable(),
  user_skills: z.array(Skill),
  user_locations: z.array(UserLocation),
  user_languages: z.array(Language),
  user_socials: z.array(Socials)
})

export const EventBasic = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasic),
  venue: VenueBasic
})

export const VenueFull = z.object({
  id: z.number(),
  bortle_rating: z.number().nullable(),
  created_at: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string(),
  logo: z.string().nullable(),
  events_hosted: z.number().nullable().optional(),
  avg_rating: z.number().nullable().optional(),
  location: Location,
  events: z.array(EventBasic)
})

export const EventFull = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasic),
  venue: VenueFull
})

export const VenueEvents = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  logo: z.string().nullable(),
  featured_image: z.string().nullable(),
  date: z.string(),
  hosts: z.array(HostBasic)
})

export const UserRoles = z.array(Role)
