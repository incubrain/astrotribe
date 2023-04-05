import * as z from 'zod'

export const Page = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  slug: z.string()
})

export const PageWithChildren = z.object({
  id: z.number(),
  name: z.string().nullable(),
  icon: z.string().nullable(),
  slug: z.string().nullable(),
  children: z.array(Page).optional()
})

export const Role = z.object({
  id: z.number(),
  name: z.string().nullable(),
  body: z.string().nullable().optional(),
  created_at: z.string().optional()
})

export const MainRole = z.object({
  id: z.number(),
  name: z.string()
})

export const Skill = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable().optional(),
  total_endorsements: z.number(),
  admin_rating: z.number(),
  rating: z.number(),
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
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

export const UserLocation = z.object({
  id: z.number(),
  created_at: z.string(),
  city: z.string(),
  country: z.string(),
  state: z.string(),
  address: z.string().nullable(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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

export const UserFull = z.object({
  id: z.number(),
  email: z.string(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  last_seen: z.string(),
  avatar: z.string().nullable(),
  cover_image: z.string().nullable(),
  introduction: z.string().nullable(),
  quote: z.string().nullable(),
  user_roles: z.array(Role),
  follow_count: z.number().nullable(),
  followed_count: z.number().nullable(),
  user_skills: z.array(Skill),
  user_locations: z.array(UserLocation),
  user_languages: z.array(Language),
  user_socials: z.array(Socials),
  main_role: MainRole
})

export const User = z.object({
  id: z.number(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  avatar: z.string().nullable(),
  introduction: z.string().nullable(),
  follow_count: z.number().nullable(),
  followed_count: z.number().nullable(),
  is_following: z.boolean().nullable(),
  main_role: MainRole,
  user_roles: z.array(Role),
  last_seen: z.string()
})

export const Venue = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  featured_image: z.string(),
  events_hosted: z.number().nullable().optional(),
  rating: z.number().nullable().optional(),
  location: z.object({
    city: z.string(),
    country: z.string(),
    address: z.string().nullable(),
    state: z.string()
  })
})

export const ATEvent = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  date: z.string(),
  hosts: z.array(
    z.object({
      id: z.number(),
      given_name: z.string(),
      avatar: z.string()
    })
  ),
  venue: Venue
})

export const UserRoles = z.array(Role)
