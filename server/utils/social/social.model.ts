import { z } from 'zod'
import { datetimeOffset } from '../formatter'

export const socialSchema = z.object({
  id: z.number().optional(),
  created_at: datetimeOffset().optional,
  updated_at: datetimeOffset().optional,
  linkedin_url: z.string().nullish(),
  youtube_url: z.string().nullish(),
  twitter_url: z.string().nullish(),
  facebook_url: z.string().nullish(),
  instagram_url: z.string().nullish()
})

const socialInsertSchema = socialSchema.omit({ id: true }).partial()
const socialUpdateSchema = socialInsertSchema

type SocialRow = z.infer<typeof socialSchema>

export class Social {
  id?: number | null
  created_at: string | null
  updated_at: string | null
  linkedin_url: string | null
  youtube_url: string | null
  twitter_url: string | null
  facebook_url: string | null
  instagram_url: string | null

  constructor(data: Partial<Social>) {
    this.id = data.id ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.created_at ?? null
    this.linkedin_url = data.linkedin_url ?? null
    this.youtube_url = data.youtube_url ?? null
    this.twitter_url = data.twitter_url ?? null
    this.facebook_url = data.facebook_url ?? null
    this.instagram_url = data.instagram_url ?? null
  }
}
