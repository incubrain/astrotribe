<script setup lang="ts">
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()

// Define professional details schema
// Currently set to required, but can be adjusted to optional in the future
const professionalDetailsSchema = z.object({
  companyName: z
    .string({ required_error: 'Company name is required' })
    .min(1, 'Company name is required'),
  position: z.string({ required_error: 'Position is required' }).min(1, 'Position is required'),
  industry: z.string({ required_error: 'Industry is required' }).min(1, 'Industry is required'),
  linkedinUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.match(/^[a-zA-Z0-9-]+$/), {
      message: 'Please enter a valid LinkedIn username (letters, numbers, and hyphens only)',
    }),
})

// Create resolver
const resolver = zodResolver(professionalDetailsSchema)

// Define initial values from store
const initialValues = {
  companyName: onboardingStore.stepData.professionalDetails?.companyName || '',
  position: onboardingStore.stepData.professionalDetails?.position || '',
  industry: onboardingStore.stepData.professionalDetails?.industry || '',
  linkedinUrl: onboardingStore.stepData.professionalDetails?.linkedinUrl || '',
}

// Industry options
const industries = [
  { label: 'Aerospace & Defense', value: 'aerospace' },
  { label: 'Research Institution', value: 'research' },
  { label: 'Government Agency', value: 'government' },
  { label: 'Education', value: 'education' },
  { label: 'Scientific Services', value: 'scientific_services' },
  { label: 'Technology', value: 'technology' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Telecommunications', value: 'telecommunications' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'Other', value: 'other' },
]

// Handle form submission
function handleSubmit(e) {
  emit('complete', e.values)
}
</script>

<template>
  <div class="professional-details-step">
    <h2 class="text-2xl font-bold mb-2">Professional Details</h2>
    <p class="text-gray-400 mb-6">
      Help us personalize your experience and connect you with relevant professionals.
    </p>

    <Form
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      @submit="handleSubmit"
    >
      <!-- Company Name -->
      <div class="mb-6">
        <label
          for="companyName"
          class="block text-sm font-medium mb-2"
          >Company Name</label
        >
        <PrimeInputText
          id="companyName"
          name="companyName"
          class="w-full"
          placeholder="Your organization's name"
        />
        <PrimeMessage
          v-if="$form.companyName?.invalid && $form.companyName?.touched"
          severity="error"
          class="mt-1 text-sm"
        >
          {{ $form.companyName.error?.message }}
        </PrimeMessage>
      </div>

      <!-- Position -->
      <div class="mb-6">
        <label
          for="position"
          class="block text-sm font-medium mb-2"
          >Your Position / Title</label
        >
        <PrimeInputText
          id="position"
          name="position"
          class="w-full"
          placeholder="e.g. Astrophysicist, Engineer, Professor"
        />
        <PrimeMessage
          v-if="$form.position?.invalid && $form.position?.touched"
          severity="error"
          class="mt-1 text-sm"
        >
          {{ $form.position.error?.message }}
        </PrimeMessage>
      </div>

      <!-- Industry -->
      <div class="mb-6">
        <label
          for="industry"
          class="block text-sm font-medium mb-2"
          >Industry</label
        >
        <PrimeSelect
          id="industry"
          name="industry"
          :options="industries"
          option-label="label"
          option-value="value"
          placeholder="Select your industry"
          class="w-full"
        />
        <PrimeMessage
          v-if="$form.industry?.invalid && $form.industry?.touched"
          severity="error"
          class="mt-1 text-sm"
        >
          {{ $form.industry.error?.message }}
        </PrimeMessage>
      </div>

      <!-- LinkedIn URL -->
      <div class="mb-6">
        <label
          for="linkedinUrl"
          class="block text-sm font-medium mb-2"
          >LinkedIn Username (Optional)</label
        >
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">linkedin.com/in/</span>
          <PrimeInputText
            id="linkedinUrl"
            name="linkedinUrl"
            placeholder="your-profile"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1">Enter just your profile name without the full URL</p>
        <PrimeMessage
          v-if="$form.linkedinUrl?.invalid && $form.linkedinUrl?.touched"
          severity="error"
          class="mt-1 text-sm"
        >
          {{ $form.linkedinUrl.error?.message }}
        </PrimeMessage>
      </div>

      <!-- Privacy note -->
      <p class="text-sm text-gray-400 mb-4">
        These details will be visible on your public profile unless you update your privacy
        settings.
      </p>

      <div class="flex justify-end mt-6">
        <PrimeButton
          type="submit"
          label="Continue"
          icon="mdi:arrow-right"
          icon-pos="right"
          :disabled="!$form.valid"
        />
      </div>
    </Form>
  </div>
</template>
