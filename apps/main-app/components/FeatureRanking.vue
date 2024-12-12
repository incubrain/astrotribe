<script setup lang="ts">
import { onMounted } from 'vue'

interface Feature {
  id: string
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'completed'
  upvotes: number
  downvotes: number
  priority_score: number
  engagement_score: number
}

const featureStore = useFeatureRequestStore()

onMounted(() => {
  featureStore.fetchFeatures()
})

// Update handleVote function
const handleVote = async (featureId: string, voteType: 1 | -1) => {
  try {
    if (voteType === -1) {
      await featureStore.voteOnFeature(featureId, voteType, '')
    } else {
      await featureStore.voteOnFeature(featureId, voteType)
    }
    // After successful vote, hide the feature
    featureStore.hideFeature(featureId)
  } catch (error) {
    console.error('Error voting on feature:', error)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Help Shape Our Roadmap</h3>
      <p class="text-sm text-gray-400">Vote on features you'd like to see</p>
    </div>

    <div
      v-if="featureStore.isLoading"
      class="space-y-2 relative"
    >
      <div
        v-for="n in 3"
        :key="n"
        class="h-24 bg-gray-800/50 animate-pulse rounded-lg"
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
          v-for="feature in featureStore.visibleFeatures"
          :key="feature.id"
          class="group relative bg-gray-800/50 p-4 rounded-lg border border-gray-700 transition-all duration-300 hover:bg-gray-800"
        >
          <!-- Feature Status Badge -->
          <div class="absolute top-3 right-3">
            <span
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-blue-900/50 text-blue-200': feature.status === 'planned',
                'bg-amber-900/50 text-amber-200': feature.status === 'in_progress',
                'bg-green-900/50 text-green-200': feature.status === 'completed',
              }"
            >
              {{ feature.status }}
            </span>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <h4 class="text-lg font-medium mb-2">{{ feature.title }}</h4>
            <p class="text-sm text-gray-400">{{ feature.description }}</p>
          </div>

          <!-- Action Bar -->
          <div class="flex items-center justify-end">
            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Upvote -->
              <button
                class="p-2 hover:bg-gray-700 rounded border border-gray-700 transition-colors duration-200 flex items-center gap-1"
                :class="{
                  'bg-green-800/50 border-green-700': featureStore.getFeatureVote(feature.id) === 1,
                }"
                @click="handleVote(feature.id, 1)"
              >
                <Icon
                  name="material-symbols:thumb-up"
                  class="w-5 h-5"
                />
                <span class="text-sm">{{ feature.upvotes }}</span>
              </button>

              <!-- Downvote -->
              <button
                class="p-2 hover:bg-gray-700 rounded border border-gray-700 transition-colors duration-200 flex items-center gap-1"
                :class="{
                  'bg-red-800/50 border-red-700': featureStore.getFeatureVote(feature.id) === -1,
                }"
                @click="handleVote(feature.id, -1)"
              >
                <Icon
                  name="material-symbols:thumb-down"
                  class="w-5 h-5"
                />
                <span class="text-sm">{{ feature.downvotes }}</span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
