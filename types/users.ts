// don't forget to add to this file if you make any changes in the database
import * as z from 'zod'

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

export const UserRoleSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  body: z.string().nullable().optional(),
  created_at: z.string().optional(),
  icon: z.string()
})

export const IdName = z.object({
  id: z.number(),
  name: z.string()
})

export const UserSkillSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable().optional(),
  total_endorsements: z.number(),
  admin_rating: z.number().nullable(),
  avg_rating: z.number().nullable(),
  created_at: z.string().optional()
})

export const UserSocialSchema = z.object({
  id: z.number(),
  url: z.string(),
  platform: z.string(),
  username: z.string()
})

export const UserBasicSchema = z.object({
  id: z.string(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  avatar: z.string().nullable(),
  introduction: z.string().nullable(),
  followers_count: z.number().nullable(),
  followed_count: z.number().nullable(),
  is_following: z.boolean().nullable(),
  role: z.number()
})

export const UserFullSchema = UserBasicSchema.extend({
  email: z.string(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  cover_image: z.string().nullable(),
  quote: z.string().nullable()
})

export const UserRowSchema = z.object({
  given_name: z.string(),
  email: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  avatar: z.string().nullable(),
  cover_image: z.string().nullable(),
  introduction: z.string().nullable(),
  plan: z.string().nullish(),
  dob: z.string().nullable(),
  quote: z.string().nullable(),
  gender_id: z.number().nullable()
})

export const UserRolesSchema = z.array(UserRoleSchema)

export type UserType = z.infer<typeof UserBasicSchema>
export type UserFullType = z.infer<typeof UserFullSchema>
export type UserRoleType = z.infer<typeof UserRoleSchema>
export type UserRowType = z.infer<typeof UserRowSchema>
export type UserSocialType = z.infer<typeof UserSocialSchema>
