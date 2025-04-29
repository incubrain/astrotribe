<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()

// Define professional details schema
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

// Initialize form with useForm
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
  validateOnBlur: true,
})

// Define all fields on mount
onMounted(() => {
  form.defineField('companyName')
  form.defineField('position')
  form.defineField('industry')
  form.defineField('linkedinUrl')
})

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
  if (e.valid) {
    emit('complete', e.values)
  }
}
</script>

<template>
  <div class="professional-details-step">
    <h2 class="text-2xl font-bold mb-2">Professional Details</h2>
    <p class="text-gray-400 mb-6">
      Help us personalize your experience and connect you with relevant professionals.
    </p>

    <PrimeForm
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Company Name -->
      <div class="mb-6">
        <label
          for="companyName"
          class="block text-sm font-medium mb-2"
          >Company Name</label
        >
        <PrimeFormField
          v-slot="field"
          name="companyName"
        >
          <PrimeInputText
            id="companyName"
            v-bind="field.props"
            class="w-full"
            placeholder="Your organization's name"
          />
          <PrimeMessage
            v-if="field.invalid && field.touched"
            severity="error"
            class="mt-1 text-sm"
          >
            {{ field.error?.message }}
          </PrimeMessage>
        </PrimeFormField>
      </div>

      <!-- Position -->
      <div class="mb-6">
        <label
          for="position"
          class="block text-sm font-medium mb-2"
          >Your Position / Title</label
        >
        <PrimeFormField
          v-slot="field"
          name="position"
        >
          <PrimeInputText
            id="position"
            v-bind="field.props"
            class="w-full"
            placeholder="e.g. Astrophysicist, Engineer, Professor"
          />
          <PrimeMessage
            v-if="field.invalid && field.touched"
            severity="error"
            class="mt-1 text-sm"
          >
            {{ field.error?.message }}
          </PrimeMessage>
        </PrimeFormField>
      </div>

      <!-- Industry -->
      <div class="mb-6">
        <label
          for="industry"
          class="block text-sm font-medium mb-2"
          >Industry</label
        >
        <PrimeFormField
          v-slot="field"
          name="industry"
        >
          <PrimeSelect
            id="industry"
            v-bind="field.props"
            :options="industries"
            option-label="label"
            option-value="value"
            placeholder="Select your industry"
            class="w-full"
          />
          <PrimeMessage
            v-if="field.invalid && field.touched"
            severity="error"
            class="mt-1 text-sm"
          >
            {{ field.error?.message }}
          </PrimeMessage>
        </PrimeFormField>
      </div>

      <!-- LinkedIn URL -->
      <div class="mb-6">
        <label
          for="linkedinUrl"
          class="block text-sm font-medium mb-2"
          >LinkedIn Username (Optional)</label
        >
        <PrimeFormField
          v-slot="field"
          name="linkedinUrl"
        >
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">linkedin.com/in/</span>
            <PrimeInputText
              id="linkedinUrl"
              v-bind="field.props"
              placeholder="your-profile"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1"
            >Enter just your profile name without the full URL</p
          >
          <PrimeMessage
            v-if="field.invalid && field.touched"
            severity="error"
            class="mt-1 text-sm"
          >
            {{ field.error?.message }}
          </PrimeMessage>
        </PrimeFormField>
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
          :disabled="!form.valid"
        />
      </div>
    </PrimeForm>
  </div>
</template>
