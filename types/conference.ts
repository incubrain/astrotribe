import { z } from 'zod'

const speakerSchema = z.object({
  title: z.string().optional(),
  given_name: z.string(),
  surname: z.string(),
  professional_title: z.string(),
  bio: z.string(),
  abstract: z.string(),
  avatar: z.string(),
  inPerson: z.boolean(),
  featured: z.boolean()
})

export type Speaker = z.infer<typeof speakerSchema>
