import { z } from 'zod'

//   {
//     key: 'professional_details',
//     label: 'Professional Details',
//     component: () => import('@/components/onboard/step/OnboardStepProfessionalDetails.vue'),
//     conditional: (data: any) => data.user_type === 'professional',
//   },

const rawOnboardingSteps = [
  {
    key: 'user_type',
    label: 'User Type',
    component: () => import('@/components/onboard/step/OnboardStepUserType.vue'),
  },
  {
    key: 'interests',
    label: 'Interests',
    component: () => import('@/components/onboard/step/OnboardStepInterests.vue'),
  },
  {
    key: 'feature_interests',
    label: 'Feature Interests',
    component: () => import('@/components/onboard/step/OnboardStepFeatures.vue'),
  },
  {
    key: 'topics',
    label: 'Topics',
    component: () => import('@/components/onboard/step/OnboardStepTopics.vue'),
  },
  {
    key: 'location',
    label: 'Location',
    component: () => import('@/components/onboard/step/OnboardStepLocation.vue'),
  },
  {
    key: 'confirmation',
    label: 'Confirmation',
    component: () => import('@/components/onboard/step/OnboardStepConfirmation.vue'),
    virtual: true,
  },
] as const

export const onboardingSchema = z.object({
  user_type: z.string().min(1, 'Please select a user type'),
  //   professional_details: z
  //     .object({
  //       organization: z.string().optional(),
  //       role: z.string().optional(),
  //       industry: z.string().optional(),
  //     })
  //     .optional()
  //     .default({}),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  feature_interests: z.array(z.string()).default([]),
  topics: z.array(z.string()).min(1, 'Please select at least one topic'),
  location: z
    .object({
      street1: z.string().optional(),
      street2: z.string().optional(),
      city_name: z.string().optional(),
      state: z.string().optional(),
      country_name: z.string().optional(),
      country_code: z.string().optional(),
      postcode: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      place_name: z.string().optional(),
    })
    .optional(),
})

export type OnboardingSchema = z.infer<typeof onboardingSchema>
export const onboardingSchemaShape = onboardingSchema.shape

export type OnboardingStepKey = (typeof rawOnboardingSteps)[number]['key']

export type OnboardingStep = {
  key: string
  label: string
  component: () => Promise<any>
  conditional?: (data: any) => boolean
  virtual?: boolean | undefined
}

export const onboardingSteps: OnboardingStep[] = [...rawOnboardingSteps]

export const formStepKeys = onboardingSteps.map((s) => s.key) as OnboardingStepKey[]
