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
  created_at: z.string().optional()
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
  auth_id: z.string().optional(),
  given_name: z.string(),
  surname: z.string().nullable(),
  username: z.string().nullable(),
  avatar: z.string().nullable(),
  introduction: z.string().nullable(),
  follow_count: z.number().nullable(),
  followed_count: z.number().nullable(),
  is_following: z.boolean().nullable(),
  main_role: IdName,
  user_roles: z.array(UserRoleSchema),
  last_seen: z.string()
})

export const UserFullSchema = UserBasicSchema.extend({
  email: z.string(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  cover_image: z.string().nullable(),
  quote: z.string().nullable(),
  user_skills: z.array(UserSkillSchema),
  user_socials: z.array(UserSocialSchema)
})

export const UserRolesSchema = z.array(UserRoleSchema)

export type User = z.infer<typeof UserBasicSchema>
export type UserFull = z.infer<typeof UserFullSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type UserSocial = z.infer<typeof UserSocialSchema>
