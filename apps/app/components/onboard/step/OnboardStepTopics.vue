<script setup lang="ts">
import { useForm } from '@primevue/forms/useform'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { ref, computed, onMounted, watch } from 'vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useCategoryTagStore } from '@/stores/useCategoryTagStore'

const emit = defineEmits(['complete'])
const onboardingStore = useOnboardingStore()
const categoryTagStore = useCategoryTagStore()
const analytics = useOnboardingAnalytics()

// Search query for filtering
const searchQuery = ref('')
const searchResults = ref([])

// Loading state
const isLoading = ref(true)

// Define topics schema
const topicsSchema = z.object({
  topics: z.array(z.string()).min(1, 'Please select at least one topic'),
})

// Create resolver
const resolver = zodResolver(topicsSchema)

// Define initial values from store
const initialValues = {
  topics: onboardingStore.stepData.topics || [],
}

// Initialize form with useForm
const form = useForm({
  resolver,
  initialValues,
  validateOnValueUpdate: true,
})

// Load tags
onMounted(async () => {
  isLoading.value = true
  try {
    await categoryTagStore.getTags()
  } catch (error) {
    console.error('Error loading tags:', error)
  } finally {
    isLoading.value = false
  }
})

// Format search results for SelectableCardField
const searchResultOptions = computed(() => {
  return searchResults.value.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))
})

// Format suggested topics for SelectableCardField
const suggestedTopicOptions = computed(() => {
  // Get first 10 tags as suggestions
  return categoryTagStore.tags.slice(0, 10).map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))
})

// Get selected topics for display
const selectedTopics = computed(() => {
  const topicIds = form.getFieldState('topics')?.value || []
  return categoryTagStore.tags
    .filter((tag) => topicIds.includes(tag.id))
    .map((tag) => ({
      value: tag.id,
      label: tag.name,
    }))
})

// Format browse topics for SelectableCardField
const browseTopicOptions = computed(() => {
  // Get a selection of tags for browsing
  return categoryTagStore.tags.slice(0, 15).map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))
})

// Filter tags by search query
function searchTags() {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = categoryTagStore.tags
    .filter((tag) => tag.name.toLowerCase().includes(query))
    .slice(0, 10) // Limit to 10 results
}

// Watch for search query changes
watch(searchQuery, () => {
  searchTags()
})

// Track tag selection for analytics
function trackTopicSelection(tagId, tagName, isSelected) {
  analytics.trackTopicSelect(tagId, tagName, isSelected ? 'select' : 'deselect')
}

// Handle form submission
function handleSubmit(e) {
  if (e.valid) {
    emit('complete', e.values)
  }
}
</script>

<template>
  <div class="topics-step">
    <h2 class="text-2xl font-bold mb-2">Select topics you'd like to follow</h2>
    <p class="text-gray-400 mb-6">These topics will personalize your feed.</p>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Topics content -->
    <PrimeForm
      v-else
      :form-control="form"
      @submit="handleSubmit"
    >
      <!-- Search box -->
      <div class="mb-6">
        <label
          for="topic-search"
          class="block text-sm font-medium mb-2"
          >Search for topics</label
        >
        <div class="relative">
          <PrimeInputText
            id="topic-search"
            v-model="searchQuery"
            class="w-full pl-10"
            placeholder="Type to search topics..."
          />
          <Icon
            name="mdi:magnify"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size="20px"
          />
        </div>
      </div>

      <!-- Search results -->
      <div
        v-if="searchQuery && searchResults.length > 0"
        class="mb-6"
      >
        <h3 class="text-sm font-medium mb-2">Search Results</h3>
        <!-- Use SelectableCardField for search results -->
        <FormSelectableCardField
          name="topics"
          :form="form"
          :options="searchResultOptions"
          :multiple="true"
          :track-selection="trackTopicSelection"
          card-class="cursor-pointer hover:bg-primary-800"
        >
          <!-- Custom card display for search results using chips -->
          <template #card-content="{ option, selected }">
            <PrimeChip
              :label="option.label"
              class="cursor-pointer"
              :class="{ 'bg-primary-800': selected }"
            />
          </template>

          <!-- Hide standard error display -->
          <template #error></template>
        </FormSelectableCardField>
      </div>

      <!-- No results message -->
      <div
        v-else-if="searchQuery && searchQuery.length >= 2"
        class="mb-6"
      >
        <p class="text-sm text-gray-400">No matching topics found.</p>
      </div>

      <!-- Suggested topics -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-2">Suggested Topics</h3>
        <!-- Use SelectableCardField for suggested topics -->
        <FormSelectableCardField
          name="topics"
          :form="form"
          :options="suggestedTopicOptions"
          :multiple="true"
          :track-selection="trackTopicSelection"
          card-class="cursor-pointer hover:bg-primary-800"
        >
          <!-- Custom chip display -->
          <template #card-content="{ option, selected }">
            <PrimeChip
              :label="option.label"
              class="cursor-pointer hover:bg-primary-800"
              :class="{ 'bg-primary-800': selected }"
            />
          </template>

          <!-- Hide standard error display -->
          <template #error></template>
        </FormSelectableCardField>
      </div>

      <!-- Selected topics -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-2">
          Selected Topics ({{ (form.getFieldState('topics')?.value || []).length }})
        </h3>
        <div
          v-if="selectedTopics.length > 0"
          class="flex flex-wrap gap-2"
        >
          <PrimeChip
            v-for="topic in selectedTopics"
            :key="topic.value"
            :label="topic.label"
            class="bg-primary-900 text-primary-100"
            removable
            @remove="
              () => {
                const currentTopics = [...(form.getFieldState('topics')?.value || [])]
                const index = currentTopics.indexOf(topic.value)
                if (index !== -1) {
                  currentTopics.splice(index, 1)
                  form.setFieldValue('topics', currentTopics)
                  trackTopicSelection(topic.value, topic.label, false)
                }
              }
            "
          />
        </div>
        <p
          v-else
          class="text-sm text-gray-400"
          >No topics selected yet.</p
        >
      </div>

      <!-- Validation error for field -->
      <PrimeFormField
        v-slot="field"
        name="topics"
      >
        <input
          type="hidden"
          v-bind="field.props"
        />
        <PrimeMessage
          v-if="field.invalid && field.touched"
          severity="error"
          class="mb-4"
        >
          {{ field.error?.message }}
        </PrimeMessage>
      </PrimeFormField>

      <!-- Browse all topics section -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-2">Browse Popular Topics</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div
            v-for="(group, index) in [categoryTagStore.tags.slice(0, 9)]"
            :key="index"
            class="space-y-2"
          >
            <div
              v-for="tag in group"
              :key="tag.id"
              class="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-800"
              :class="{ 'bg-primary-900/40': selectedTopics.some((t) => t.value === tag.id) }"
              @click="
                () => {
                  const currentTopics = [...(form.getFieldState('topics')?.value || [])]
                  const index = currentTopics.indexOf(tag.id)
                  if (index === -1) {
                    currentTopics.push(tag.id)
                    form.setFieldValue('topics', currentTopics)
                    trackTopicSelection(tag.id, tag.name, true)
                  } else {
                    currentTopics.splice(index, 1)
                    form.setFieldValue('topics', currentTopics)
                    trackTopicSelection(tag.id, tag.name, false)
                  }
                }
              "
            >
              <Icon
                :name="
                  selectedTopics.some((t) => t.value === tag.id) ? 'mdi:check-circle' : 'mdi:tag'
                "
                class="mr-2"
                :class="
                  selectedTopics.some((t) => t.value === tag.id)
                    ? 'text-primary-500'
                    : 'text-gray-400'
                "
                size="20px"
              />
              <span>{{ tag.name }}</span>
            </div>
          </div>
        </div>
      </div>

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
