import { z } from 'zod'

// !task:low:easy:1 - extract enums for reuse, consider having all schemas in one file
// although it makes it easy to edit the schemas with them in the same model file
const contactTypeEnum = z.enum(['Company', 'Recruitment', 'Professional', 'Founder', 'Personal'])
const privacyLevelEnum = z.enum(['Private', 'Connected', 'Public'])

export const contactSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  title: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  is_primary: z.boolean().nullable(),
  contact_type: contactTypeEnum.nullable(),
  privacy_level: privacyLevelEnum.nullable(),
  company_id: z.number().nullable(),
  user_id: z.string().nullable()
})

const contactInsertSchema = contactSchema.omit({ id: true }).partial()
const contactUpdateSchema = contactInsertSchema

type ContactTypeEnum = z.infer<typeof contactTypeEnum>
type PrivacyLevelEnum = z.infer<typeof privacyLevelEnum>

export class Contact {
  id: number | null
  created_at: Date | null
  updated_at: Date | null
  contact_type: ContactTypeEnum | null
  privacy_level?: PrivacyLevelEnum
  title?: string
  email?: string
  phone?: string
  is_primary: boolean | null
  user_id: string | null
  company_id: number | null

  constructor(data: Partial<Contact>) {
    this.title = data.title ?? undefined
    this.email = data.email ?? undefined
    this.phone = data.phone ?? undefined
    this.privacy_level = data.privacy_level ?? undefined
    this.id = data.id ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.created_at ?? null
    this.contact_type = data.contact_type ?? null
    this.is_primary = data.is_primary ?? null
    this.company_id = data.company_id ?? null
    this.user_id = data.user_id ?? null
  }
}
