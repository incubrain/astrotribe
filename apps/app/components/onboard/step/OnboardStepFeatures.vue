<script setup lang="ts">
import { Form } from '@primevue/forms'
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

// Load features
onMounted(async () => {
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

// Handle form submission
function handleSubmit(e) {
  emit('complete', e.values)
}

// Track feature selection
function trackFeatureToggle(featureId, featureTitle, isSelected) {
  analytics.trackFeatureInterestClick(featureId, featureTitle, isSelected ? 'select' : 'deselect')
}

// Handle selecting/deselecting a feature
function toggleFeature($form, featureId, featureTitle) {
  const currentFeatures = [...($form.featureInterests?.value || [])]
  const index = currentFeatures.indexOf(featureId)

  if (index === -1) {
    // Add to selected
    currentFeatures.push(featureId)
    trackFeatureToggle(featureId, featureTitle, true)
  } else {
    // Remove from selected
    currentFeatures.splice(index, 1)
    trackFeatureToggle(featureId, featureTitle, false)
  }

  // Use setFieldValue instead of directly calling onInput/onBlur
  $form.setFieldValue('featureInterests', currentFeatures)
}

// Check if a feature is selected
function isFeatureSelected(featureInterests, featureId) {
  return featureInterests && featureInterests.includes(featureId)
}

// Filter features by status (only show planned or in-progress features)
const upcomingFeatures = computed(() => {
  return features.value.filter(
    (f) => f.status === 'planned' || f.status === 'in_progress' || f.status === 'in-progress',
  )
})
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
    <Form
      v-else-if="upcomingFeatures.length > 0"
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      @submit="handleSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <PrimeCard
          v-for="feature in upcomingFeatures"
          :key="feature.id"
          :class="{
            'border-primary-500 bg-primary-900/20': isFeatureSelected(
              $form.featureInterests?.value,
              feature.id,
            ),
            'border-gray-700 hover:border-gray-500': !isFeatureSelected(
              $form.featureInterests?.value,
              feature.id,
            ),
          }"
          class="cursor-pointer transition-all hover:shadow-md"
          @click="toggleFeature($form, feature.id, feature.title)"
        >
          <template #header>
            <div class="flex justify-between items-center p-3">
              <div
                class="badge py-1 px-2 rounded-full text-xs uppercase"
                :class="{
                  'bg-blue-900 text-blue-200': feature.status === 'planned',
                  'bg-yellow-900 text-yellow-200':
                    feature.status === 'in_progress' || feature.status === 'in-progress',
                }"
              >
                {{ feature.status.replace('_', ' ') }}
              </div>
              <Icon
                v-if="isFeatureSelected($form.featureInterests?.value, feature.id)"
                name="mdi:check-circle"
                class="text-primary-500"
                size="24px"
              />
            </div>
          </template>

          <template #content>
            <div class="p-3">
              <h3 class="text-lg font-medium mb-2">{{ feature.title }}</h3>
              <p
                v-if="feature.description"
                class="text-sm text-gray-400"
                >{{ feature.description }}</p
              >
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Validation error -->
      <PrimeMessage
        v-if="$form.featureInterests?.invalid && $form.featureInterests?.touched"
        severity="error"
        class="mb-4"
      >
        {{ $form.featureInterests.error?.message }}
      </PrimeMessage>

      <!-- Selected count info -->
      <div class="text-sm text-gray-400 mb-4">
        {{ ($form.featureInterests?.value || []).length }} features selected
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
