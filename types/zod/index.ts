import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import * as forms from './forms'
import * as users from './users'
import * as toasts from './toasts'
import * as pages from './pages'
import * as posts from './posts'
import * as events from './events'

// Forms
export const LoginValidation = toTypedSchema(forms.LoginValidation)
export const RegisterValidation = toTypedSchema(forms.RegisterValidation)
export const ForgotPasswordValidation = toTypedSchema(forms.ForgotPasswordValidation)
export const ResetPasswordValidation = toTypedSchema(forms.ResetPasswordValidation)
export const ProfessionalInfoValidation = toTypedSchema(forms.ProfessionalInfoValidation)
export const SocialMediaValidation = toTypedSchema(forms.SocialMediaValidation)
export const LocationValidation = toTypedSchema(forms.LocationValidation)
export const InterestValidation = toTypedSchema(forms.InterestValidation)
export const RegisterInterestValidation = toTypedSchema(forms.RegisterInterestValidation)

// Form Components
export const CheckboxOptionValidation = forms.CheckboxOptionValidation

// Users
export const UserFullValidation = users.UserFullValidation
export const UserBasicValidation = users.UserBasicValidation
export const UserRoleValidation = users.UserRoleValidation
export const UserSkillValidation = users.UserSkillValidation
export const UserLanguageValidation = users.UserLanguageValidation
export const UserSocialValidation = users.UserSocialValidation
export const UserLocationValidation = users.UserLocationValidation
export const UserRolesValidation = users.UserRolesValidation

// Venues
export const VenueBasicValidation = events.VenueBasicValidation
export const VenueEventsValidation = events.VenueEventsValidation
export const VenueFullValidation = events.VenueFullValidation

// Events
export const HostBasicValidation = events.HostBasicValidation
export const EventBasicValidation = events.EventBasicValidation
export const EventFullValidation = events.EventFullValidation

// Posts
export const PostValidation = posts.PostValidation
export const NewsValidation = posts.NewsValidation

// Pages
export const PageValidation = pages.PageValidation

// Toasts
export const ToastValidation = toasts.ToastValidator
export const ToastStateValidation = toasts.ToastStateValidator
export const ToastActionValidation = toasts.ToastActionValidator

export const NasaImgValidation = z.object({
  title: z.string(),
  explanation: z.string(),
  date: z.string(),
  url: z.string(),
  hdurl: z.string(),
  media_type: z.string(),
  copyright: z.string(),
  service_version: z.string()
})
