<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, computed, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const analytics = useOnboardingAnalytics()

// We'll fetch features directly from the API
const features = ref([])
const isLoading = ref(true)
const error = ref(null)

// Define features schema - requiring at least one selection
const featuresSchema = z.object({
  featureInterests: z.array(z.string()).min(1, 'Please select at least one feature'),
})

// Create resolver
const resolver = zodResolver(featuresSchema)

// Define initial values from store
const initialValues = {
  featureInterests: onboardingStore.stepData.featureInterests || [],
}

// Initialize form with useForm
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
})

// Define field on mount
onMounted(async () => {
  form.defineField('featureInterests')

  // Load features
  isLoading.value = true
  try {
    const response = await fetch('/api/onboard/features')
    // Check if the response is valid JSON before parsing
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response. Please check the API endpoint.')
    }
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    features.value = data
  } catch (err) {
    console.error('Error loading features:', err)
    error.value = err.message || 'Failed to load features'
  } finally {
    isLoading.value = false
  }
})

// Filter features by status (only show planned or in-progress features)
const upcomingFeatures = computed(() => {
  return features.value
    .filter(
      (f) => f.status === 'planned' || f.status === 'in_progress' || f.status === 'in-progress',
    )
    .map((feature) => ({
      value: feature.id,
      label: feature.title,
      description: feature.description || '',
      status: feature.status,
    }))
})

// Track feature selection
function trackFeatureToggle(featureId, featureTitle, isSelected) {
  analytics.trackFeatureInterestClick(featureId, featureTitle, isSelected ? 'select' : 'deselect')
}

// Handle form submission
function handleSubmit(e) {
  if (e.valid) {
    emit('complete', e.values)
  }
}
</script>

<template>
  <div class="features-step">
    <h2 class="text-2xl font-bold mb-2">Which upcoming features excite you?</h2>
    <p class="text-gray-400 mb-6">Help us prioritize by selecting features you'd find valuable.</p>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Features grid -->
    <PrimeForm
      v-else-if="upcomingFeatures.length > 0"
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Use SelectableCardField for feature selection -->
      <FormSelectableCardField
        name="featureInterests"
        :form="form"
        :options="upcomingFeatures"
        :multiple="true"
        :track-selection="trackFeatureToggle"
        card-class="cursor-pointer transition-all hover:shadow-md"
      >
        <!-- Custom card content with feature info -->
        <template #card-content="{ option, selected }">
          <div>
            <!-- Feature header with badge -->
            <div class="flex justify-between items-center p-3">
              <div
                class="badge py-1 px-2 rounded-full text-xs uppercase"
                :class="{
                  'bg-blue-900 text-blue-200': option.status === 'planned',
                  'bg-yellow-900 text-yellow-200':
                    option.status === 'in_progress' || option.status === 'in-progress',
                }"
              >
                {{ option.status.replace('_', ' ') }}
              </div>
              <Icon
                v-if="selected"
                name="mdi:check-circle"
                class="text-primary-500"
                size="24px"
              />
            </div>

            <!-- Feature content -->
            <div class="p-3">
              <h3 class="text-lg font-medium mb-2">{{ option.label }}</h3>
              <p
                v-if="option.description"
                class="text-sm text-gray-400"
                >{{ option.description }}</p
              >
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

    <!-- No features message -->
    <div
      v-else-if="!isLoading && !error"
      class="my-8 text-center"
    >
      <p class="text-gray-400">No upcoming features available at the moment.</p>
      <PrimeButton
        label="Continue"
        icon="mdi:arrow-right"
        icon-pos="right"
        class="mt-4"
        @click="emit('complete', { featureInterests: [] })"
      />
    </div>
  </div>
</template>
