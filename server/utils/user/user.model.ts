import { z } from 'zod'
import { datetimeOffset } from '../formatter'

const AppPlanEnum = z.enum(['free', 'basic', 'intermediate', 'premium', 'enterprise', 'custom']);
const AppRoleEnum = z.enum(['guest', 'user', 'astroguide', 'mentor', 'moderator', 'tenant_member', 'tenant_admin', 'tenant_super_admin', 'admin', 'super_admin']);
const UserStatus = z.enum(['ONLINE', 'OFFLINE']);

export type AppPlanEnum = z.infer<typeof AppPlanEnum>;
export type AppRoleEnum = z.infer<typeof AppRoleEnum>;
export type UserStatus = z.infer<typeof UserStatus>;

export const userFollowerInsertSchema = z.object({
  followed_id: z.string().uuid({ message: 'Invalid UUID' }),
  follower_id: z.string().uuid({ message: 'Invalid UUID' }),
  id: z.string().uuid({ message: 'Invalid UUID' })
})

export const userSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }),
  dob: z.string().nullish(),
  email: z.string().nullish(),
  gender_id: z.number().gte(0, 'Gender is required').nullish(),
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
  plan: AppPlanEnum,
  role: AppRoleEnum
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
  plan: AppPlanEnum | undefined
  role: AppRoleEnum | undefined

  constructor(user: Partial<User>) {
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
    this.plan = user.plan
    this.role = user.role
  }
}
