import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { phoneNumberValidator } from './phoneNumber'

export const passwordSchema = z
  .string()
  .min(8, 'Password must contain 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character')

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match'
  })

export const LoginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
})

export const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match'
  })

export const CheckboxOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string()
})

export const ProfessionalInfoSchema = z.object({
  occupation: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  workEmail: z.string().email().optional(),
  workPhoneNumber: phoneNumberValidator.optional()
})

export const LocationSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional()
})

export const SocialMediaSchema = z.object({
  linkedinProfile: z.string().url().optional(),
  facebookProfile: z.string().url().optional(),
  twitterHandle: z.string().url().optional(),
  instagramHandle: z.string().url().optional()
})

export const InterestSchema = z.object({
  stargazing: z.boolean().optional(),
  learning: z.boolean().optional(),
  news: z.boolean().optional(),
  hostingEvents: z.boolean().optional(),
  attendingEvents: z.boolean().optional(),
  collaborating: z.boolean().optional(),
  networking: z.boolean().optional()
})

const formFieldSchema = z.object({
  name: z.string(),
  width: z.literal('full' || 'half'),
  props: z.object({
    label: z.string(),
    type: z.string(),
    suggested: z.string().optional(),
    disabled: z.boolean().optional()
  })
})

export const InterestForm = toTypedSchema(InterestSchema)
export const SocialMediaForm = toTypedSchema(SocialMediaSchema)
export const LocationForm = toTypedSchema(LocationSchema)
export const ProfessionalInfoForm = toTypedSchema(ProfessionalInfoSchema)
export const RegisterForm = toTypedSchema(RegisterSchema)
export const LoginForm = toTypedSchema(LoginSchema)
export const ForgotPasswordForm = toTypedSchema(ForgotPasswordSchema)
export const ResetPasswordForm = toTypedSchema(ResetPasswordSchema)
export const CheckboxOptionForm = toTypedSchema(CheckboxOptionSchema)

export type SocialMediaT = z.infer<typeof SocialMediaSchema>
export type InterestType = z.infer<typeof InterestSchema>
export type LocationType = z.infer<typeof LocationSchema>
export type ProfessionalInfoType = z.infer<typeof ProfessionalInfoSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type RegisterType = z.infer<typeof RegisterSchema>
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
export type CheckboxOptionType = z.infer<typeof CheckboxOptionSchema>
export type FormFieldT = z.infer<typeof formFieldSchema>
