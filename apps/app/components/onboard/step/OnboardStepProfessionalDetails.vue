<script setup lang="ts">
import type { FormInstance } from '@primevue/forms'

defineProps<{ form: FormInstance }>()

const industries = [
  { label: 'Aerospace', value: 'aerospace' },
  { label: 'Research', value: 'research' },
  { label: 'Government', value: 'government' },
  { label: 'Education', value: 'education' },
  { label: 'Technology', value: 'technology' },
  { label: 'Other', value: 'other' },
]
</script>

<template>
  <div class="professional-details-step">
    <h2 class="text-2xl font-bold mb-2">Professional Details</h2>
    <p class="text-gray-400 mb-6">
      This helps us tailor relevant recommendations and connect you with others in your field.
    </p>

    <!-- Organization -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Organization</label>
      <PrimeFormField
        v-slot="field"
        name="organization"
      >
        <PrimeInputText
          v-bind="field.props"
          class="w-full"
          placeholder="Your organization or institution"
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

    <!-- Role -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Your Role</label>
      <PrimeFormField
        v-slot="field"
        name="role"
      >
        <PrimeInputText
          v-bind="field.props"
          class="w-full"
          placeholder="e.g. Engineer, Researcher, Educator"
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
      <label class="block text-sm font-medium mb-2">Industry</label>
      <PrimeFormField
        v-slot="field"
        name="industry"
      >
        <PrimeSelect
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
  </div>
</template>
