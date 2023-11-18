import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const passwordValidation = z
  .string()
  .min(8, 'Password must contain 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character')

export const SettingsPasswordValidation = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmNewPassword: passwordValidation
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })

export const SettingsAccountValidation = z.object({
  given_name: z.string().min(1, 'Given Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email(),
  introduction: z.string().min(240, 'At least 240 characters required').optional(),
  quote: z.string().min(10, 'At least 10 characters required').optional()
})

export const FormAccountSchema = toTypedSchema(SettingsAccountValidation)
export const FormPasswordSchema = toTypedSchema(SettingsPasswordValidation)

export type SettingsAccountType = z.infer<typeof SettingsAccountValidation>
export type SettingsPasswordType = z.infer<typeof SettingsPasswordValidation>
