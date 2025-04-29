<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, computed, onMounted } from 'vue'

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

// Initialize form with useForm
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
})

// Format categories for SelectableCardField
const categoryOptions = computed(() => {
  return categoryTagStore.categories.map((category) => ({
    value: category.id,
    label: category.name,
    description: category.body || '',
  }))
})

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

// Track category selection for analytics
function trackInterestSelection(categoryId, categoryName, isSelected) {
  analytics.trackInterestSelect(categoryId, categoryName, isSelected ? 'select' : 'deselect')
}

// Handle form submission
function handleSubmit(e) {
  if (e.valid) {
    emit('complete', e.values)
  }
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
    <PrimeForm
      v-else
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Use SelectableCardField for multi-selection of interests -->
      <FormSelectableCardField
        name="interests"
        :form="form"
        :options="categoryOptions"
        :multiple="true"
        :track-selection="trackInterestSelection"
      >
        <!-- Customize card-content to use check icons -->
        <template #card-content="{ option, selected }">
          <div class="flex items-center gap-3 p-2">
            <div class="w-6 h-6 flex items-center justify-center">
              <Icon
                :name="selected ? 'mdi:check-circle' : 'mdi:circle-outline'"
                size="24px"
                :class="selected ? 'text-primary-500' : 'text-gray-400'"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium">{{ option.label }}</h3>
              <p
                v-if="option.description"
                class="text-sm text-gray-400"
              >
                {{ option.description }}
              </p>
            </div>
          </div>
        </template>
      </FormSelectableCardField>

      <!-- Navigation buttons -->
      <div class="flex justify-end mt-6">
        <PrimeButton
          type="submit"
          label="Continue"
          icon="mdi:arrow-right"
          icon-pos="right"
          :disabled="!form.valid || isLoading"
        />
      </div>
    </PrimeForm>
  </div>
</template>
