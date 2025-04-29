<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

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

// Initial values
const initialValues = {
  userType: 'hobbyist',
}

// useForm instance
const form = useForm({
  resolver,
  initialValues: initialValues,
  validateOnValueUpdate: true,
})

onMounted(() => {
  form.defineField('userType')
})

// Options
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
  {
    value: 'other',
    label: 'Other',
    icon: 'mdi:account',
    description: 'None of the above',
  },
]

// Utility to set selected value
function setValue(value: string) {
  form.setFieldValue('userType', value)
}

// Utility to get live selected value
function selectedValue() {
  return form.getFieldState('userType')?.value
}

// Submit handler
function handleSubmit(e) {
  if (e.valid) {
    const selectedType = userTypes.find((t) => t.value === e.values.userType)
    if (selectedType) {
      analytics.trackInterestSelect('user_type', selectedType.label)
    }
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <PrimeCard
          v-for="type in userTypes"
          :key="type.value"
          :class="{
            'border-primary-500 bg-primary-500/20': selectedValue() === type.value,
            'border-gray-700 bg-gray-800/20': selectedValue() !== type.value,
          }"
          class="cursor-pointer transition-all hover:shadow-md"
          @click="() => setValue(type.value)"
        >
          <template #content>
            <div class="flex items-center gap-3 p-2">
              <div class="rounded-full flex p-3 bg-gray-800">
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

      <!-- Validation error message -->
      <PrimeFormField
        v-slot="field"
        name="userType"
      >
        <PrimeMessage
          v-if="field.invalid && field.touched"
          severity="error"
          class="mb-4"
        >
          {{ field.error?.message }}
        </PrimeMessage>
      </PrimeFormField>

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
