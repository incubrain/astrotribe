import { z } from 'zod'
import { datetimeOffset } from '../formatter'

export const userFollowerInsertSchema = z.object({
  followed_id: z.string().uuid({ message: 'Invalid UUID' }),
  follower_id: z.string().uuid({ message: 'Invalid UUID' }),
  id: z.string().uuid({ message: 'Invalid UUID' })
})

export const roleSchema = z.object({
  id: z.number(),
  created_at: datetimeOffset('test in role schema created_at').optional,
  name: z.string().min(1, 'Name is required'),
  body: z.string().min(1, 'Body is required').nullish()
})

export const userSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }),
  dob: z.string().nullish(),
  email: z.string().nullish(),
  gender_id: z.number().gte(0, 'Gender is required').nullish(),
  role_id: z.number().gte(0, 'Role is required').nullish(),
  given_name: z.string().min(1, 'Given Name is required').nullish(),
  surname: z.string().min(1, 'Surname is required').nullish(),
  introduction: z.string().min(1, 'Introduction is required').nullish(),
  quote: z.string().min(1, 'Quote is required').nullish(),
  username: z.string().min(1, 'Username is required').nullish(),
  avatar: z.string().min(1, 'Avatar is required').nullish(),
  cover_image: z.string().min(1, 'Cover Image is required').nullish(),
  created_at: datetimeOffset('user_profile:created_at incorrect datetime format').optional,
  updated_at: datetimeOffset('user_profile:updated_at incorrect datetime format').optional,
  last_seen: datetimeOffset('user_profile:last_seen incorrect datetime format').optional,
  roles: roleSchema.optional()
})

// !todo:med - we will always return the role, should create a sql function for this
// !todo:high - determine how we will seperately format inbound and outbound data
// outbound will be easy as it will be for ui components, inbound mostly relies on the settings page, admin func and scrapers

export class Follower {
  followed_id: string
  follower_id: string
  id: string

  constructor(follower: any) {
    this.followed_id = follower.followed_id
    this.follower_id = follower.follower_id
    this.id = follower.id
  }
}

export class Role {
  id: number
  created_at: Date
  name: string
  body: string

  constructor(role: any) {
    this.id = role.id
    this.created_at = role.created_at
    this.name = role.name
    this.body = role.body
  }
}

export class User {
  id: string
  dob: Date
  email: string
  gender_id: number
  given_name: string
  surname: string
  introduction: string
  quote: string
  username: string
  avatar: string
  cover_image: string
  created_at: Date
  updated_at: Date
  last_seen: string
  role_id: number
  roles: Role | null

  constructor(user: any) {
    this.id = user.id
    this.dob = user.dob
    this.email = user.email
    this.avatar = user.avatar
    this.cover_image = user.cover_image
    this.created_at = user.created_at
    this.updated_at = user.updated_at
    this.last_seen = user.last_seen
    this.given_name = user.given_name
    this.surname = user.surname
    this.gender_id = user.gender_id
    this.introduction = user.introduction
    this.quote = user.quote
    this.username = user.username
    this.role_id = user.role_id
    this.roles = user.roles ? new Role(user.roles) : null
  }
}
