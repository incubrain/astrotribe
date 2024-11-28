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
    const { data } = await useFetch('/api/feature/list', {
      method: 'GET',
    })
    features.value = data.value
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

  features.value = newFeatures

  try {
    await $fetch('/api/feature/rank', {
      method: 'POST',
      body: {
        rankings: features.value.map((f) => f.id),
      },
    })
  } catch (error) {
    console.error('Error saving rankings:', error)
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
        class="space-y-2"
      >
        <div
          v-for="(feature, index) in features"
          :key="feature.id"
          class="group bg-gray-800/50 p-4 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-800 flex"
        >
          <div class="flex items-start gap-4">
            <!-- Rank Badge -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
            >
              <span class="font-medium text-sm">{{ index + 1 }}</span>
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <h4 class="font-medium">{{ feature.title }}</h4>
              <p class="text-sm text-gray-400">{{ feature.description }}</p>
            </div>

            <!-- Controls -->
            <div
              class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 h-full justify-center items-center transition-opacity"
            >
              <button
                :disabled="index === 0"
                class="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed flex"
                :class="{ 'cursor-not-allowed': index === 0 }"
                @click="moveFeature(index, 'up')"
              >
                <Icon
                  name="mdi:chevron-up"
                  :class="{ 'text-gray-400': index === 0 }"
                />
              </button>
              <button
                :disabled="index === features.length - 1"
                class="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed flex"
                :class="{ 'cursor-not-allowed': index === features.length - 1 }"
                @click="moveFeature(index, 'down')"
              >
                <Icon
                  name="mdi:chevron-down"
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
