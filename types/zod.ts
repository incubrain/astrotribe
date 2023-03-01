import * as z from 'zod'

export const Post = z.object({
  id: z.number(),
  created_at: z.string().nullable(),
  user_id: z.string().nullable(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  image: z.string().nullable(),
  status_id: z.number(),
})

export const News = z.object({
  title: z.string().nullable(),
  body: z.string().nullable(),
  author: z.string().nullable(),
  published: z.string().nullable(),
  category: z.string().nullable(),
})


export const User = z.object({
  id: z.number(),
  email: z.string(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  location_id: z.number().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  last_seen: z.string().nullable(),
  user_roles: z.array(
      z.object({
          id: z.number(),
          title: z.string(),
          created_at: z.string(),
          body: z.string().nullable(),
      }).nullable()
  ).nullable(),
})

export const Follower = z.object({
  id: z.number(),
  email: z.string(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  location_id: z.number().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  last_seen: z.string().nullable(),
})

export const UserBasic = z.object({
  id: z.number(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  featured_image: z.string().nullable(),
  user_roles: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
    }),
  ),
  last_seen: z.string().nullable(),
})

export const Event = z.object({
  id: z.number(),
  venue_id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  created_at: z.date(),
  date: z.date(),
})

export const Venue = z.object({
  id: z.number(),
  venue_id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  created_at: z.date(),
  date: z.date(),
})

export interface ZodInterface {
  Post: typeof Post;
  News: typeof News;
  User: typeof User;
  Follower: typeof Follower;
  UserBasic: typeof UserBasic;
  Event: typeof Event;
  Venue: typeof Venue;
}