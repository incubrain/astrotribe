import { z } from 'zod'

export const PositionSchema = z.object({
  title: z.string(),
  description: z.string(),
  joining: z.string()
})

export const SocialSchema = z.object({
  id: z.number(),
  platform: z.string(),
  url: z.string(),
  username: z.string()
})

export const AchievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  url: z.string().optional()
})

export const PublicitySchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  url: z.string().optional()
})

export const TeamMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: PositionSchema,
  avatar: z.string(),
  bio: z.string(),
  socials: z.array(SocialSchema),
  achievements: z.array(AchievementSchema),
  publicity: z.array(PublicitySchema)
})

export const TeamSchema = z.array(TeamMemberSchema)

// Infer types
export type PositionType = z.infer<typeof PositionSchema>
export type SocialType = z.infer<typeof SocialSchema>
export type AchievementType = z.infer<typeof AchievementSchema>
export type PublicityType = z.infer<typeof PublicitySchema>
export type TeamMemberType = z.infer<typeof TeamMemberSchema>
export type TeamType = z.infer<typeof TeamSchema>
