<script setup lang="ts">
import { Form } from '@primevue/forms'
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

// Handle form submission
function handleSubmit(e) {
  emit('complete', e.values)
}

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

// Handle input changes
watch(searchQuery, () => {
  searchTags()
})

// Track tag selection
function trackTopicToggle(tagId, tagName, isSelected) {
  analytics.trackTopicSelect(tagId, tagName, isSelected ? 'select' : 'deselect')
}

// Handle selecting/deselecting a tag
function toggleTopic($form, tagId, tagName) {
  const currentTopics = [...($form.topics?.value || [])]
  const index = currentTopics.indexOf(tagId)

  if (index === -1) {
    // Add to selected
    currentTopics.push(tagId)
    trackTopicToggle(tagId, tagName, true)
  } else {
    // Remove from selected
    currentTopics.splice(index, 1)
    trackTopicToggle(tagId, tagName, false)
  }

  // Update form value
  $form.setFieldValue('topics', currentTopics)
}

// Remove a selected tag
function removeTopic($form, tagId, tagName) {
  const currentTopics = [...($form.topics?.value || [])]
  const index = currentTopics.indexOf(tagId)

  if (index !== -1) {
    currentTopics.splice(index, 1)
    trackTopicToggle(tagId, tagName, false)
    $form.setFieldValue('topics', currentTopics)
  }
}

// Check if a tag is selected
function isTopicSelected(topics, tagId) {
  return topics && topics.includes(tagId)
}

// Get selected tags for display
function getSelectedTags(selectedIds) {
  return categoryTagStore.tags
    .filter((tag) => selectedIds.includes(tag.id))
    .map((tag) => ({ id: tag.id, name: tag.name }))
}

// Suggest popular topics (use actual tags from loaded data)
const suggestedTopics = computed(() => {
  // Get a random selection of tags (limit to 10)
  return categoryTagStore.tags.slice(0, 10).map((tag) => ({
    id: tag.id,
    name: tag.name,
  }))
})
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
    <Form
      v-else
      v-slot="$form"
      :resolver="resolver"
      :initial-values="initialValues"
      @submit="handleSubmit"
    >
      <!-- Hidden input for topics array -->
      <input
        type="hidden"
        name="topics"
      />

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
        <div class="flex flex-wrap gap-2">
          <PrimeChip
            v-for="tag in searchResults"
            :key="tag.id"
            :label="tag.name"
            class="cursor-pointer hover:bg-primary-800"
            :class="{ 'bg-primary-800': isTopicSelected($form.topics?.value, tag.id) }"
            @click="toggleTopic($form, tag.id, tag.name)"
          />
        </div>
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
        <div class="flex flex-wrap gap-2">
          <PrimeChip
            v-for="topic in suggestedTopics"
            :key="topic.id"
            :label="topic.name"
            class="cursor-pointer hover:bg-primary-800"
            :class="{ 'bg-primary-800': isTopicSelected($form.topics?.value, topic.id) }"
            @click="toggleTopic($form, topic.id, topic.name)"
          />
        </div>
      </div>

      <!-- Selected topics -->
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-2">
          Selected Topics ({{ ($form.topics?.value || []).length }})
        </h3>
        <div
          v-if="$form.topics?.value?.length > 0"
          class="flex flex-wrap gap-2"
        >
          <PrimeChip
            v-for="tag in getSelectedTags($form.topics.value)"
            :key="tag.id"
            :label="tag.name"
            class="bg-primary-900 text-primary-100"
            removable
            @remove="removeTopic($form, tag.id, tag.name)"
          />
        </div>
        <p
          v-else
          class="text-sm text-gray-400"
          >No topics selected yet.</p
        >
      </div>

      <!-- Validation error -->
      <PrimeMessage
        v-if="$form.topics?.invalid && $form.topics?.touched"
        severity="error"
        class="mb-4"
      >
        {{ $form.topics.error?.message }}
      </PrimeMessage>

      <!-- Browse all topics section (simplified) -->
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
              :class="{ 'bg-primary-900/40': isTopicSelected($form.topics?.value, tag.id) }"
              @click="toggleTopic($form, tag.id, tag.name)"
            >
              <Icon
                :name="
                  isTopicSelected($form.topics?.value, tag.id) ? 'mdi:check-circle' : 'mdi:tag'
                "
                class="mr-2"
                :class="
                  isTopicSelected($form.topics?.value, tag.id)
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
          :disabled="!$form.valid || isLoading"
        />
      </div>
    </Form>
  </div>
</template>
