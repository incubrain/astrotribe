import * as z from 'zod'
import * as schema from './zod/index'

// Form Types
export type LoginForm = z.infer<typeof schema.LoginValidation>
export type RegisterForm = z.infer<typeof schema.RegisterValidation>
export type ForgotPasswordForm = z.infer<typeof schema.ForgotPasswordValidation>
export type ResetPasswordForm = z.infer<typeof schema.ResetPasswordValidation>
export type ProfessionalInfoForm = z.infer<typeof schema.ProfessionalInfoValidation>
export type SocialMediaForm = z.infer<typeof schema.SocialMediaValidation>
export type LocationForm = z.infer<typeof schema.LocationValidation>
export type InterestForm = z.infer<typeof schema.InterestValidation>
export type RegisterInterestForm = z.infer<typeof schema.RegisterInterestValidation>
export type CheckboxOptionForm = z.infer<typeof schema.CheckboxOptionValidation>

// User Types
export type UserFull = z.infer<typeof schema.UserFullValidation>
export type UserBasic = z.infer<typeof schema.UserBasicValidation>
export type UserRole = z.infer<typeof schema.UserRoleValidation>
export type UserSkill = z.infer<typeof schema.UserSkillValidation>
export type UserLanguage = z.infer<typeof schema.UserLanguageValidation>
export type UserSocial = z.infer<typeof schema.UserSocialValidation>
export type UserLocation = z.infer<typeof schema.UserLocationValidation>
export type UserRoles = z.infer<typeof schema.UserRolesValidation>

// Venue Types
export type VenueBasic = z.infer<typeof schema.VenueBasicValidation>
export type VenueEvents = z.infer<typeof schema.VenueEventsValidation>
export type VenueFull = z.infer<typeof schema.VenueFullValidation>

// Event Types
export type EventHost = z.infer<typeof schema.HostBasicValidation>
export type EventBasic = z.infer<typeof schema.EventBasicValidation>
export type EventFull = z.infer<typeof schema.EventFullValidation>

// Post Types
export type Post = z.infer<typeof schema.PostValidation>
export type News = z.infer<typeof schema.NewsValidation>

// Page Types
export type Page = z.infer<typeof schema.PageValidation>

// Toast Types
export type Toast = z.infer<typeof schema.ToastValidation>
export type ToastState = z.infer<typeof schema.ToastStateValidation>
export type ToastAction = z.infer<typeof schema.ToastActionValidation>
