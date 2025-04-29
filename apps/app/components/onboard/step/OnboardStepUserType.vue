<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const analytics = useOnboardingAnalytics()

// Define schema
const userTypeSchema = z.object({
  userType: z.string({
    required_error: 'Please select how you identify yourself',
  }),
})

// Resolver
const resolver = zodResolver(userTypeSchema)

// Initial values from store
const initialValues = {
  userType: onboardingStore.stepData.userType || '',
}

// useForm instance
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
})

// Define user type options
const userTypes = [
  {
    value: 'professional',
    label: 'Professional',
    icon: 'mdi:briefcase',
    description: 'Working in the astronomy or space industry',
  },
  {
    value: 'hobbyist',
    label: 'Hobbyist',
    icon: 'mdi:telescope',
    description: 'Space and astronomy enthusiast',
  },
  {
    value: 'researcher',
    label: 'Researcher',
    icon: 'mdi:flask',
    description: 'Engaged in academic or scientific research',
  },
  {
    value: 'student',
    label: 'Student',
    icon: 'mdi:school',
    description: 'Studying astronomy or related field',
  },
  { value: 'other', label: 'Other', icon: 'mdi:account', description: 'None of the above' },
]

// Track user type selection for analytics
function trackUserTypeSelection(value, label, isSelected) {
  if (isSelected) {
    analytics.trackInterestSelect('user_type', label)
  }
}

// Submit handler
function handleSubmit(e) {
  if (e.valid) {
    emit('complete', e.values)
  }
}
</script>

<template>
  <div class="user-type-step">
    <h2 class="text-2xl font-bold mb-2">How do you identify yourself?</h2>
    <p class="text-gray-400 mb-6">This helps us personalize your experience.</p>

    <PrimeForm
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Use the reusable SelectableCardField component -->
      <FormSelectableCardField
        name="userType"
        :form="form"
        :options="userTypes"
        :multiple="false"
        :track-selection="trackUserTypeSelection"
      />

      <div class="flex justify-end mt-6">
        <PrimeButton
          type="submit"
          label="Continue"
          icon="mdi:arrow-right"
          icon-pos="right"
          :disabled="!form.valid"
        />
      </div>
    </PrimeForm>
  </div>
</template>
