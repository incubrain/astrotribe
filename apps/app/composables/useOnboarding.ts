import { ref, reactive } from 'vue'
import { type ZodSchema, z } from 'zod'

const accountDetailsSchema = z.object({
  dateOfBirth: z.date().max(new Date(), 'Date of birth cannot be in the future'),
})

const professionalInfoSchema = z.object({
  occupation: z.string().min(1, 'Please select an occupation'),
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  experience: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(100, 'Experience cannot exceed 100 years'),
})

export interface SignupForm {
  dateOfBirth: Date | null
  occupation: string
  organization: string
  experience: number | null
  interests: string[]
}

export function useOnboarding() {
  const form = reactive<SignupForm>({
    dateOfBirth: null,
    occupation: '',
    organization: '',
    experience: null,
    interests: [],
  })

  const errors = reactive<Partial<Record<keyof SignupForm, string>>>({})

  const validateAndUpdate = (schema: ZodSchema) => {
    const result = schema.safeParse(form)
    if (result.success) {
      Object.keys(errors).forEach((key) => delete errors[key as keyof SignupForm])
      return true
    } else {
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as keyof SignupForm] = issue.message
      })
      return false
    }
  }

  return {
    form,
    errors,
    validateAndUpdate,
    professionalInfoSchema,
    accountDetailsSchema,
  }
}
