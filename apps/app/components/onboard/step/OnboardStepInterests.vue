<script setup lang="ts">
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, computed, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useCategoryTagStore } from '@/stores/useCategoryTagStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const categoryTagStore = useCategoryTagStore()
const analytics = useOnboardingAnalytics()

// Loading state
const isLoading = ref(true)

// Define interests schema
const interestsSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
})

// Create resolver
const resolver = zodResolver(interestsSchema)

// Define initial values from store
const initialValues = {
  interests: onboardingStore.stepData.interests || [],
}

// Load categories
onMounted(async () => {
  isLoading.value = true
  try {
    await categoryTagStore.getCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    isLoading.value = false
  }
})

// Handle form submission
function handleSubmit(e) {
  emit('complete', e.values)
}

// Track category selection
function trackInterestToggle(categoryId, categoryName, isSelected) {
  analytics.trackInterestSelect(categoryId, categoryName, isSelected ? 'select' : 'deselect')
}

// Toggle interest and update form state
function toggleInterest($form, categoryId, categoryName) {
  const currentInterests = [...($form.interests?.value || [])]
  const index = currentInterests.indexOf(categoryId)

  if (index === -1) {
    // Add to selected
    currentInterests.push(categoryId)
    trackInterestToggle(categoryId, categoryName, true)
  } else {
    // Remove from selected
    currentInterests.splice(index, 1)
    trackInterestToggle(categoryId, categoryName, false)
  }

  // Update form state
  $form.setFieldValue('interests', currentInterests)
}

// Check if a category is selected
function isInterestSelected(interests, categoryId) {
  return interests && interests.includes(categoryId)
}
</script>

<template>
  <div class="interests-step">
    <h2 class="text-2xl font-bold mb-2">What topics are you interested in?</h2>
    <p class="text-gray-400 mb-6">Select categories that match your interests.</p>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Categories grid -->
    <Form
      v-else
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      @submit="handleSubmit"
    >
      <!-- Hidden input for storing the interests array -->
      <input
        type="hidden"
        name="interests"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <PrimeCard
          v-for="category in categoryTagStore.categories"
          :key="category.id"
          :class="{
            'border-primary-500 bg-primary-900/20': isInterestSelected(
              $form.interests?.value,
              category.id,
            ),
            'border-gray-700 hover:border-gray-500': !isInterestSelected(
              $form.interests?.value,
              category.id,
            ),
          }"
          class="cursor-pointer transition-all hover:shadow-md"
          @click="toggleInterest($form, category.id, category.name)"
        >
          <template #content>
            <div class="flex items-center gap-3 p-2">
              <div class="w-6 h-6 flex items-center justify-center">
                <Icon
                  :name="
                    isInterestSelected($form.interests?.value, category.id)
                      ? 'mdi:check-circle'
                      : 'mdi:circle-outline'
                  "
                  size="24px"
                  :class="
                    isInterestSelected($form.interests?.value, category.id)
                      ? 'text-primary-500'
                      : 'text-gray-400'
                  "
                />
              </div>
              <div>
                <h3 class="text-lg font-medium">{{ category.name }}</h3>
                <p
                  v-if="category.body"
                  class="text-sm text-gray-400"
                  >{{ category.body }}</p
                >
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Validation error -->
      <PrimeMessage
        v-if="$form.interests?.invalid && $form.interests?.touched"
        severity="error"
        class="mb-4"
      >
        {{ $form.interests.error?.message }}
      </PrimeMessage>

      <!-- Selected count info -->
      <div class="text-sm text-gray-400 mb-4">
        {{ ($form.interests?.value || []).length }} categories selected
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-end mt-6">
        <PrimeButton
          type="submit"
          label="Continue"
          icon="mdi:arrow-right"
          icon-pos="right"
          :disabled="!$form.valid || isLoading"
        />
      </div>
    </Form>
  </div>
</template>
