// don't forget to add to this file if you make any changes in the database
import * as z from 'zod'

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

export const UserRoleValidation = z.object({
  id: z.number(),
  name: z.string().nullable(),
  body: z.string().nullable().optional(),
  created_at: z.string().optional()
})

export const IdName = z.object({
  id: z.number(),
  name: z.string()
})

export const UserSkillValidation = z.object({
  id: z.number(),
  title: z.string().nullable(),
  body: z.string().nullable().optional(),
  total_endorsements: z.number(),
  admin_rating: z.number().nullable(),
  avg_rating: z.number().nullable(),
  created_at: z.string().optional()
})

export const UserLanguageValidation = z.object({
  id: z.number(),
  name: z.string(),
  iso_639_1: z.string().optional(),
  iso_639_2: z.string().optional()
})

export const UserSocialValidation = z.object({
  id: z.number(),
  url: z.string(),
  platform: z.string(),
  username: z.string().nullable()
})

export const UserLocationValidation = LocationValidation.extend({
  from: z.string().optional(),
  to: z.string().optional(),
  is_home: z.boolean()
})

export const UserBasicValidation = z.object({
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
  user_roles: z.array(UserRoleValidation),
  last_seen: z.string()
})

export const UserFullValidation = UserBasicValidation.extend({
  email: z.string(),
  dob: z.string().nullable(),
  gender_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  cover_image: z.string().nullable(),
  quote: z.string().nullable(),
  user_skills: z.array(UserSkillValidation),
  user_locations: z.array(UserLocationValidation),
  user_languages: z.array(UserLanguageValidation),
  user_socials: z.array(UserSocialValidation)
})

export const UserRolesValidation = z.array(UserRoleValidation)
