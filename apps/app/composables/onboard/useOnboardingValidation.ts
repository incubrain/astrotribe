import { reactive, ref, computed } from 'vue'
import { z } from 'zod'

export function useOnboardingValidation() {
  // Common validation state
  const errors = reactive<Record<string, string>>({})
  const touchedFields = reactive<Record<string, boolean>>({})

  // Mark a field as touched when user interacts with it
  function touchField(fieldName: string) {
    touchedFields[fieldName] = true
  }

  // Check if a field should show validation errors
  function shouldShowError(fieldName: string) {
    return touchedFields[fieldName] && !!errors[fieldName]
  }

  // Clear errors for a specific step
  function clearErrors(step: number) {
    const stepFields = getFieldsForStep(step)
    stepFields.forEach((field) => {
      delete errors[field]
    })
  }

  // Get fields for a specific step
  function getFieldsForStep(step: number): string[] {
    switch (step) {
      case 1: // User Type
        return ['userType']
      case 2: // Professional Details
        return ['companyName', 'position', 'industry', 'linkedinUrl']
      case 3: // Interests
        return ['interests']
      case 4: // Feature Interests
        return ['featureInterests']
      case 5: // Topics
        return ['topics']
      case 6: // Location
        return ['countryId', 'cityId']
      default:
        return []
    }
  }

  // User Type Step Validation
  const userTypeSchema = z.object({
    userType: z.string({
      required_error: 'Please select how you identify yourself',
    }),
  })

  function validateUserType(data: any) {
    try {
      userTypeSchema.parse(data)
      clearErrors(1)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Professional Details Step Validation
  const professionalDetailsSchema = z.object({
    companyName: z.string().optional(),
    position: z.string().optional(),
    industry: z.string().optional(),
    linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  })

  function validateProfessionalDetails(data: any) {
    try {
      professionalDetailsSchema.parse(data)
      clearErrors(2)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Interests Step Validation
  const interestsSchema = z.object({
    interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  })

  function validateInterests(data: any) {
    try {
      interestsSchema.parse(data)
      clearErrors(3)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Feature Interests Step Validation
  // This is optional, so we don't require any selections
  const featureInterestsSchema = z.object({
    featureInterests: z.array(z.string()).optional(),
  })

  function validateFeatureInterests(data: any) {
    try {
      featureInterestsSchema.parse(data)
      clearErrors(4)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Topics Step Validation
  const topicsSchema = z.object({
    topics: z.array(z.string()).min(1, 'Please select at least one topic'),
  })

  function validateTopics(data: any) {
    try {
      topicsSchema.parse(data)
      clearErrors(5)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Location Step Validation
  const locationSchema = z.object({
    countryId: z.string().optional(),
    cityId: z.string().optional(),
  })

  function validateLocation(data: any) {
    try {
      locationSchema.parse(data)
      clearErrors(6)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message
        })
      }
      return false
    }
  }

  // Validate a specific step
  function validateStep(step: number, data: any) {
    switch (step) {
      case 1:
        return validateUserType(data)
      case 2:
        return validateProfessionalDetails(data)
      case 3:
        return validateInterests(data)
      case 4:
        return validateFeatureInterests(data)
      case 5:
        return validateTopics(data)
      case 6:
        return validateLocation(data)
      default:
        return true
    }
  }

  return {
    errors,
    touchedFields,
    touchField,
    shouldShowError,
    clearErrors,
    validateStep,
    validateUserType,
    validateProfessionalDetails,
    validateInterests,
    validateFeatureInterests,
    validateTopics,
    validateLocation,
  }
}
