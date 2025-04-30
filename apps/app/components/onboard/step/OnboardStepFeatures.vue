<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormInstance } from '@primevue/forms'

defineProps<{ form: FormInstance }>()

interface Feature {
  id: string
  title: string
  description?: string
  status?: 'planned' | 'building' | 'launched'
}

const features = ref<Feature[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fallbackFeatures: Feature[] = [
  {
    id: '1',
    title: 'AI-Powered Content Recommendations',
    description: 'Get personalized news and content recommendations based on your interests.',
    status: 'planned',
  },
  {
    id: '2',
    title: 'Astronomy Event Alerts',
    description:
      'Receive notifications for upcoming astronomical events visible from your location.',
    status: 'building',
  },
  {
    id: '3',
    title: 'Interactive Sky Maps',
    description: 'Explore the night sky with interactive maps.',
    status: 'planned',
  },
  {
    id: '4',
    title: 'Community Forums',
    description: 'Connect with other space enthusiasts in topic-specific forums.',
    status: 'planned',
  },
]

// Define field and load features
onMounted(async () => {
  try {
    const response = await fetch('/api/feature/list', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) throw new Error(`Server error: ${response.statusText}`)

    const data = await response.json()
    features.value = Array.isArray(data) && data.length > 0 ? data : fallbackFeatures
  } catch (err) {
    console.error('Error loading features:', err)
    error.value = (err as Error).message || 'Failed to load features'
    features.value = fallbackFeatures
  } finally {
    isLoading.value = false
  }
})

// Filter to upcoming features
const upcomingFeatures = computed(() =>
  features.value
    .filter((f) => f.status === 'planned' || f.status === 'building')
    .map((f) => ({
      value: f.id,
      label: f.title,
      description: f.description || '',
      status: f.status || 'planned',
    })),
)
</script>

<template>
  <div class="features-step">
    <h2 class="text-2xl font-bold mb-2">Which upcoming features excite you?</h2>
    <p class="text-gray-400 mb-6">Help us prioritize by selecting features you'd find valuable.</p>

    <!-- Loading spinner -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Feature selection -->
    <div v-else-if="upcomingFeatures.length > 0">
      <FormSelectableCardField
        name="feature_interests"
        :options="upcomingFeatures"
        :multiple="true"
      >
        <template #card-content="{ option, selected }">
          <div>
            <div class="flex justify-between items-center p-3">
              <div
                class="badge py-1 px-2 rounded-full text-xs uppercase"
                :class="{
                  'bg-blue-900 text-blue-200': option.status === 'planned',
                  'bg-yellow-900 text-yellow-200': option.status === 'building',
                }"
              >
                {{ option.status }}
              </div>
              <Icon
                v-if="selected"
                name="mdi:check-circle"
                class="text-primary-500"
                size="24px"
              />
            </div>
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
    </div>
  </div>
</template>
