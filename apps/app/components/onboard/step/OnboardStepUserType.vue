<script setup lang="ts">
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const analytics = useOnboardingAnalytics()

// Define user type schema
const userTypeSchema = z.object({
  userType: z.string({
    required_error: 'Please select how you identify yourself',
  }),
})

// Create resolver
const resolver = zodResolver(userTypeSchema)

// Define initial values from store
const initialValues = {
  userType: onboardingStore.stepData.userType || null,
}

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

// Handle form submission
function handleSubmit(e) {
  // Track the selection
  if (e.values.userType) {
    const selectedType = userTypes.find((t) => t.value === e.values.userType)
    if (selectedType) {
      analytics.trackInterestSelect('user_type', selectedType.label)
    }
  }

  // Complete the step
  emit('complete', e.values)
}

// Handle card selection
function selectUserType(type, formState) {
  // Create an input change event
  const changeEvent = {
    target: {
      value: type.value,
    },
  }

  // Dispatch the change event to a hidden input
  const hiddenInput = document.getElementById('userTypeInput')
  if (hiddenInput) {
    hiddenInput.value = type.value
    hiddenInput.dispatchEvent(new Event('input', { bubbles: true }))
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  // Track analytics
  const selectedType = userTypes.find((t) => t.value === type.value)
  if (selectedType) {
    analytics.trackInterestSelect('user_type', selectedType.label)
  }
}
</script>

<template>
  <div class="user-type-step">
    <h2 class="text-2xl font-bold mb-2">How do you identify yourself?</h2>
    <p class="text-gray-400 mb-6">This helps us personalize your experience.</p>

    <Form
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      @submit="handleSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <PrimeCard
          v-for="type in userTypes"
          :key="type.value"
          :class="{
            'border-primary-500 bg-primary-900/20': $form.userType?.value === type.value,
            'border-gray-700 hover:border-gray-500': $form.userType?.value !== type.value,
          }"
          class="cursor-pointer transition-all hover:shadow-md"
          @click="selectUserType(type, $form)"
        >
          <template #content>
            <div class="flex items-center gap-3 p-2">
              <div class="rounded-full p-3 bg-gray-800">
                <Icon
                  :name="type.icon"
                  size="24px"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium">{{ type.label }}</h3>
                <p class="text-sm text-gray-400">{{ type.description }}</p>
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Hidden input to track the selected value -->
      <PrimeInputText
        id="userTypeInput"
        name="userType"
        type="hidden"
      />

      <!-- Validation error message -->
      <PrimeMessage
        v-if="$form.userType?.invalid && $form.userType?.touched"
        severity="error"
        class="mb-4"
      >
        {{ $form.userType.error?.message }}
      </PrimeMessage>

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
