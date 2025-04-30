import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { onboardingSchema } from './onboard-steps'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

let formInstance: ReturnType<typeof useForm> | null = null

export function useOnboardingForm() {
  const onboardingStore = useOnboardingStore()

  // Only initialize once
  if (!formInstance) {
    console.log('Initializing onboarding form...')
    onboardingStore.initialize()

    const form = useForm({
      resolver: zodResolver(onboardingSchema),
      initialValues: onboardingStore.stepData,
      validateOnValueUpdate: false,
      validateOnBlur: true,
      validateOnSubmit: true,
    })

    onMounted(() => {
      form.defineField('user_type')
      form.defineField('interests')
      form.defineField('feature_interests')
      form.defineField('topics')
      form.defineField('location')

      // professional details subfields

      //   form.defineField('professional_details')
      //   form.defineField('organization')
      //   form.defineField('role')
      //   form.defineField('industry')
    })

    formInstance = form
  }

  return formInstance
}
