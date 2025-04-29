<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { ref, computed, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useCategoryTagStore } from '@/stores/useCategoryTagStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const categoryTagStore = useCategoryTagStore()
const analytics = useOnboardingAnalytics()

// Loading states
const isLoading = ref(false)
const isLoadingData = ref(true)

// Get all data from the store
const stepData = computed(() => onboardingStore.stepData)

// Initialize a simple form without validation
const form = useForm({
  initialValues: {},
})

// Load reference data for display
onMounted(async () => {
  isLoadingData.value = true
  try {
    // Load categories and tags if not already loaded
    if (categoryTagStore.categories.length === 0) {
      await categoryTagStore.getCategories()
    }

    if (categoryTagStore.tags.length === 0) {
      await categoryTagStore.getTags()
    }
  } catch (error) {
    console.error('Error loading reference data:', error)
  } finally {
    isLoadingData.value = false
  }
})

// Format user type for display
const userTypeLabel = computed(() => {
  const userTypeMap = {
    professional: 'Professional',
    hobbyist: 'Hobbyist',
    researcher: 'Researcher',
    student: 'Student',
    other: 'Other',
  }

  return userTypeMap[stepData.value.userType || ''] || 'Not specified'
})

// Get selected categories for display
const selectedCategories = computed(() => {
  const categoryIds = stepData.value.interests || []
  return categoryTagStore.categories
    .filter((cat) => categoryIds.includes(cat.id))
    .map((cat) => cat.name)
})

// Get selected tags for display
const selectedTags = computed(() => {
  const tagIds = stepData.value.topics || []
  return categoryTagStore.tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name)
})

// Get location display text
const locationDisplay = computed(() => {
  const location = stepData.value.location
  if (!location || !location.placeName) {
    return 'Not specified'
  }

  if (location.city && location.country) {
    return `${location.city}, ${location.country}`
  }

  return location.placeName
})

// Handle completion
function completeOnboarding(e) {
  isLoading.value = true

  try {
    // Track completion event
    analytics.trackOnboardingComplete(stepData.value)

    // Complete onboarding
    emit('complete', stepData.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="confirmation-step">
    <h2 class="text-2xl font-bold mb-2">You're all set!</h2>
    <p class="text-gray-400 mb-6">Review your preferences before completing the setup.</p>

    <!-- Loading state -->
    <div
      v-if="isLoadingData"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Summary content -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- User Type -->
      <div class="p-4 bg-gray-800/50 rounded-lg">
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:account"
            class="mr-2"
            size="20px"
          />
          User Type
        </h3>
        <p>{{ userTypeLabel }}</p>
      </div>

      <!-- Professional Details (if applicable) -->
      <div
        v-if="stepData.userType === 'professional' && stepData.professionalDetails"
        class="p-4 bg-gray-800/50 rounded-lg"
      >
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:briefcase"
            class="mr-2"
            size="20px"
          />
          Professional Details
        </h3>
        <div class="space-y-2">
          <p v-if="stepData.professionalDetails.companyName">
            <span class="text-gray-400">Company:</span>
            {{ stepData.professionalDetails.companyName }}
          </p>
          <p v-if="stepData.professionalDetails.position">
            <span class="text-gray-400">Position:</span> {{ stepData.professionalDetails.position }}
          </p>
          <p v-if="stepData.professionalDetails.industry">
            <span class="text-gray-400">Industry:</span> {{ stepData.professionalDetails.industry }}
          </p>
          <p v-if="stepData.professionalDetails.linkedinUrl">
            <span class="text-gray-400">LinkedIn:</span> linkedin.com/in/{{
              stepData.professionalDetails.linkedinUrl
            }}
          </p>
        </div>
      </div>

      <!-- Interests -->
      <div class="p-4 bg-gray-800/50 rounded-lg">
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:star"
            class="mr-2"
            size="20px"
          />
          Content Interests
        </h3>
        <div
          v-if="selectedCategories.length > 0"
          class="flex flex-wrap gap-2"
        >
          <PrimeChip
            v-for="category in selectedCategories"
            :key="category"
            :label="category"
          />
        </div>
        <p
          v-else
          class="text-gray-400"
          >No interests selected</p
        >
      </div>

      <!-- Topics -->
      <div class="p-4 bg-gray-800/50 rounded-lg">
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:tag-multiple"
            class="mr-2"
            size="20px"
          />
          Topics
        </h3>
        <div
          v-if="selectedTags.length > 0"
          class="flex flex-wrap gap-2"
        >
          <PrimeChip
            v-for="tag in selectedTags"
            :key="tag"
            :label="tag"
          />
        </div>
        <p
          v-else
          class="text-gray-400"
          >No topics selected</p
        >
      </div>

      <!-- Feature Interests -->
      <div class="p-4 bg-gray-800/50 rounded-lg">
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:rocket"
            class="mr-2"
            size="20px"
          />
          Feature Interests
        </h3>
        <div
          v-if="stepData.featureInterests?.length > 0"
          class="flex flex-wrap gap-2"
        >
          <PrimeChip
            v-for="(featureId, index) in stepData.featureInterests"
            :key="index"
            :label="'Feature #' + (index + 1)"
          />
        </div>
        <p
          v-else
          class="text-gray-400"
          >No feature interests selected</p
        >
      </div>

      <!-- Location -->
      <div class="p-4 bg-gray-800/50 rounded-lg">
        <h3 class="text-lg font-medium mb-2 flex items-center">
          <Icon
            name="mdi:map-marker"
            class="mr-2"
            size="20px"
          />
          Location
        </h3>
        <p>{{ locationDisplay }}</p>
      </div>

      <!-- Edit note -->
      <p class="text-sm text-gray-400">
        You can edit these preferences later in your profile settings.
      </p>
    </div>

    <!-- Form for submission -->
    <PrimeForm
      :form-control="form"
      @submit="completeOnboarding"
    >
      <!-- Finish button -->
      <div class="flex justify-end mt-8">
        <PrimeButton
          type="submit"
          label="Start Exploring"
          icon="mdi:rocket"
          icon-pos="right"
          :loading="isLoading"
        />
      </div>
    </PrimeForm>
  </div>
</template>
