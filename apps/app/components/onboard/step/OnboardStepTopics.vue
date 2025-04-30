<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryTagStore } from '@/stores/useCategoryTagStore'

const form = useOnboardingForm()

const categoryTagStore = useCategoryTagStore()

const isLoading = ref(true)

// Load tags and define the field
onMounted(async () => {
  try {
    await categoryTagStore.getTags()
  } catch (error) {
    console.error('Error loading tags:', error)
  } finally {
    isLoading.value = false
  }
})

// Get selected topics
const selectedTopics = computed(() => {
  const topicIds = form.getFieldState('topics')?.value || []
  if (topicIds.length === 0) return []

  return categoryTagStore.tags
    .filter((tag) => topicIds.includes(tag.id))
    .map((tag) => ({
      value: tag.id,
      label: tag.name,
    }))
})

// Check if topic is selected
const isTopicSelected = (tagId: string) => {
  const topicIds = form.getFieldState('topics')?.value || []
  return Array.isArray(topicIds) && topicIds.includes(tagId)
}

// Toggle topic selection
function toggleTopic(tagId: string) {
  const currentTopics = Array.isArray(form.getFieldState('topics')?.value)
    ? [...form.getFieldState('topics')!.value]
    : []

  const index = currentTopics.indexOf(tagId)

  if (index === -1) {
    currentTopics.push(tagId)
  } else {
    currentTopics.splice(index, 1)
  }

  form.setFieldValue('topics', currentTopics)
}
</script>

<template>
  <div class="topics-step">
    <h2 class="text-2xl font-bold mb-2">Select topics you'd like to follow</h2>
    <p class="text-gray-400 mb-6">These topics will personalize your feed.</p>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex justify-center my-8"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Topics content -->
    <div v-else>
      <!-- Selected Topics -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-3">Selected Topics</h3>
        <div class="relative">
          <div
            v-if="selectedTopics.length > 0"
            class="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar"
          >
            <PrimeChip
              v-for="topic in selectedTopics"
              :key="topic.value"
              :label="topic.label"
              class="bg-primary-600 text-white shrink-0"
              removable
              @remove="toggleTopic(topic.value)"
            />
          </div>
          <div
            v-else
            class="text-sm text-gray-400 p-4 bg-gray-800/30 rounded-lg border border-gray-700"
          >
            No topics selected yet.
          </div>

          <!-- Count chip -->
          <PrimeChip
            v-if="selectedTopics.length > 0"
            :label="selectedTopics.length.toString()"
            class="absolute -top-2 -right-2 bg-primary-800 text-white font-bold min-w-8 h-8 flex items-center justify-center"
          />
        </div>
      </div>

      <!-- Validation error -->
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

      <!-- Browse topics -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-3">Browse Topics</h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-scroll max-h-80 px-2 border border-primary-800 rounded-lg"
        >
          <div
            v-for="tag in categoryTagStore.tags"
            :key="tag.id"
            class="flex items-center p-3 rounded-lg cursor-pointer border border-gray-700 transition-all duration-200"
            :class="{
              'bg-primary-900/40 border-primary-600': isTopicSelected(tag.id),
              'hover:bg-gray-800/60 hover:border-gray-600': !isTopicSelected(tag.id),
            }"
            @click="toggleTopic(tag.id)"
          >
            <Icon
              :name="isTopicSelected(tag.id) ? 'mdi:check-circle' : 'mdi:tag'"
              class="mr-3"
              :class="isTopicSelected(tag.id) ? 'text-primary-500' : 'text-gray-400'"
              size="22px"
            />
            <span class="font-medium">{{ tag.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
