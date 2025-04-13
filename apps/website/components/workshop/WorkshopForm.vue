<script setup lang="ts">
import { ref, reactive } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

defineOptions({
  name: 'TelescopeWorkshopContactForm',
})

// Define props
const props = defineProps({
  workshopTitle: {
    type: String,
    default: 'Telescope Setting Workshop',
  },
})

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  workshopPreference: z.string().min(1, 'Please select a workshop preference'),
  preferredDate: z.date().nullable().optional(),
  equipment: z.string().optional(),
  experience: z.string().min(1, 'Please select your experience level'),
  message: z.string().optional(),
})

// Form resolver
const formResolver = zodResolver(formSchema)

// Initial form values
const initialValues = reactive({
  name: '',
  email: '',
  phone: '',
  workshopPreference: 'beginner',
  preferredDate: null,
  equipment: '',
  experience: '',
  message: '',
})

// Workshop preferences
const workshopPreferences = [
  { name: 'Beginner Level Workshop', value: 'beginner' },
  { name: 'Intermediate Level Workshop', value: 'intermediate' },
]

// Experience levels
const experienceLevels = [
  { name: 'No experience with telescopes', value: 'none' },
  { name: 'Beginner - used telescopes a few times', value: 'beginner' },
  { name: 'Intermediate - own a telescope', value: 'intermediate' },
  { name: 'Advanced - experienced astronomer', value: 'advanced' },
]

// Form dialog state
const {
  isDialogVisible,
  isSubmitting,
  submitSuccess,
  submitError,
  successMessage,
  errorMessage,
  openDialog,
  setSuccess,
  setError,
  startSubmitting,
  stopSubmitting,
} = useFormDialog()

// Form submission
const submitForm = async (result) => {
  if (!result.valid) {
    return
  }

  startSubmitting()

  try {
    // Simulating API call for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(
      "Thank you for your interest! We'll contact you with workshop details when we have enough participants.",
    )

    // Close dialog after 3 seconds on success
    setTimeout(() => {
      isDialogVisible.value = false
    }, 3000)
  } catch (error) {
    console.error('Form submission error:', error)
    setError('There was an error submitting your request. Please try again or contact us directly.')
  } finally {
    stopSubmitting()
  }
}

// Expose the openDialog method for parent components
defineExpose({
  openDialog,
})
</script>

<template>
  <div>
    <IBFormDialog
      v-model:visible="isDialogVisible"
      :title="`Register Interest: ${workshopTitle}`"
      :loading="isSubmitting"
      :success-message="submitSuccess ? successMessage : ''"
      :error-message="submitError ? errorMessage : ''"
      submit-button-text="Submit Registration"
      :initial-values="initialValues"
      :resolver="formResolver"
      @submit="submitForm"
    >
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <IBFormField
            id="name"
            name="name"
            label="Full Name"
            required
            :initial-value="initialValues.name"
          >
            <template #default="{ field }">
              <PrimeInputText
                id="name"
                v-model="field.value"
                class="w-full"
                placeholder="Your name"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="email"
            name="email"
            label="Email Address"
            required
            :initial-value="initialValues.email"
          >
            <template #default="{ field }">
              <PrimeInputText
                id="email"
                v-model="field.value"
                type="email"
                class="w-full"
                placeholder="your.email@example.com"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="phone"
            name="phone"
            label="Phone Number"
            required
            :initial-value="initialValues.phone"
          >
            <template #default="{ field }">
              <PrimeInputText
                id="phone"
                v-model="field.value"
                class="w-full"
                placeholder="Your phone number"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="experience"
            name="experience"
            label="Experience Level"
            required
            :initial-value="initialValues.experience"
          >
            <template #default="{ field }">
              <PrimeDropdown
                id="experience"
                v-model="field.value"
                :options="experienceLevels"
                option-label="name"
                option-value="value"
                placeholder="Select your experience level"
                class="w-full"
              />
            </template>
          </IBFormField>

          <!-- Workshop Preferences -->
          <IBFormField
            id="workshopPreference"
            name="workshopPreference"
            label="Workshop Preference"
            required
            :initial-value="initialValues.workshopPreference"
          >
            <template #default="{ field }">
              <PrimeDropdown
                id="workshopPreference"
                v-model="field.value"
                :options="workshopPreferences"
                option-label="name"
                option-value="value"
                placeholder="Select workshop type"
                class="w-full"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="preferredDate"
            name="preferredDate"
            label="Preferred Date/Month"
            :initial-value="initialValues.preferredDate"
          >
            <template #default="{ field }">
              <PrimeCalendar
                id="preferredDate"
                v-model="field.value"
                class="w-full"
                placeholder="Select date (if any)"
                show-icon
                selection-mode="month"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="equipment"
            name="equipment"
            label="Do you have your own telescope?"
            :initial-value="initialValues.equipment"
          >
            <template #default="{ field }">
              <PrimeInputText
                id="equipment"
                v-model="field.value"
                class="w-full"
                placeholder="E.g., Yes, Celestron 6SE / No, but interested in purchasing"
              />
            </template>
          </IBFormField>

          <IBFormField
            id="message"
            name="message"
            label="Additional Information"
            :full-width="true"
            :initial-value="initialValues.message"
          >
            <template #default="{ field }">
              <PrimeTextarea
                id="message"
                v-model="field.value"
                rows="4"
                class="w-full"
                placeholder="Any specific questions or requirements?"
              />
            </template>
          </IBFormField>
        </div>

        <div class="mt-4 bg-primary-900/40 p-4 rounded-lg text-sm text-primary-200">
          <div class="flex items-start gap-2">
            <Icon
              name="mdi:information-outline"
              class="mt-0.5 flex-shrink-0"
            />
            <div>
              <p
                >Workshops are limited to 15 participants per session for an optimal learning
                experience. We'll contact you with available dates once we have enough
                registrations.</p
              >
            </div>
          </div>
        </div>
      </template>
    </IBFormDialog>
  </div>
</template>
