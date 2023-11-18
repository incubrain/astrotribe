import { z } from 'zod'

const AuthorSchema = z.object({
  id: z.number().optional(),
  name: z.string().nullable(),
  link: z.string().nullable(),
  image: z.string().nullable()
})

export type AuthorType = z.infer<typeof AuthorSchema>
