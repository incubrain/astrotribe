<!-- components/feature/FeatureRanking.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Feature {
  id: string
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'completed'
}

const features = ref<Feature[]>([])
const error = ref<Error | null>(null)
const isLoading = ref(true)

const fetchFeatures = async () => {
  try {
    const data = await $fetch('/api/feature/list', {
      method: 'GET',
    })
    features.value = data
  } catch (err) {
    error.value = err
    console.error('Error fetching features:', err)
  } finally {
    isLoading.value = false
  }
}

const moveFeature = async (currentIndex: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (newIndex < 0 || newIndex >= features.value.length) return

  const newFeatures = [...features.value]
  const [movedItem] = newFeatures.splice(currentIndex, 1)
  newFeatures.splice(newIndex, 0, movedItem)

  // Update local state immediately for optimistic UI update
  features.value = newFeatures

  try {
    // Make API call to persist the changes
    await $fetch('/api/feature/rank', {
      method: 'POST',
      body: {
        rankings: features.value.map((f) => f.id),
      },
    })
  } catch (error) {
    console.error('Error saving rankings:', error)
    // Optionally, revert the change if the API call fails
    // await fetchFeatures()
  }
}

onMounted(() => {
  fetchFeatures()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Help Us Prioritize</h3>
      <p class="text-sm text-gray-400">Rank features by importance</p>
    </div>

    <div
      v-if="isLoading"
      class="space-y-2"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="h-16 bg-gray-800 animate-pulse rounded-lg"
      />
    </div>

    <div
      v-else
      class="space-y-2"
    >
      <TransitionGroup
        name="list"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="(feature, index) in features"
          :key="feature.id"
          class="group relative bg-gray-800/50 p-4 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-800 flex"
        >
          <div class="flex items-center gap-4">
            <!-- Rank Badge -->
            <div
              class="absolute -top-3 -left-3 flex-shrink-0 border border-color w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center"
            >
              <span class="font-semibold text-base">{{ index + 1 }}</span>
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <h4 class="font-medium">{{ feature.title }}</h4>
              <p class="text-sm text-gray-400">{{ feature.description }}</p>
            </div>

            <!-- Controls -->
            <div class="flex flex-col gap-4 h-full justify-center items-center">
              <button
                :disabled="index === 0"
                class="p-3 hover:bg-gray-700 border border-color rounded disabled:opacity-50 disabled:cursor-not-allowed flex"
                :class="{ 'cursor-not-allowed': index === 0 }"
                @click="moveFeature(index, 'up')"
              >
                <Icon
                  name="mdi:chevron-up"
                  size="20"
                  :class="{ 'text-gray-400': index === 0 }"
                />
              </button>
              <button
                :disabled="index === features.length - 1"
                class="p-3 hover:bg-gray-700 rounded disabled:opacity-50 border border-color disabled:cursor-not-allowed flex"
                :class="{ 'cursor-not-allowed': index === features.length - 1 }"
                @click="moveFeature(index, 'down')"
              >
                <Icon
                  name="mdi:chevron-down"
                  size="20"
                  :class="{ 'text-gray-400': index === features.length - 1 }"
                />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.list-move {
  transition: transform 0.3s ease;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
