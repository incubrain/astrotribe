<!-- UserMetricsDashboard.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useVotesStore } from '~/stores/useVoteStore'
import { storeToRefs } from 'pinia'

const voteStore = useVoteStore()
const {
  isLoading,
  totalVotes,
  upvoteCount,
  downvoteCount,
  voteAccuracy,
  streakInfo,
  todayVoteCount,
} = storeToRefs(voteStore)

onMounted(async () => {
  await voteStore.fetchMetrics()
})
</script>

<template>
  <div class="p-6 min-h-screen">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center h-64"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Top Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Votes Card -->
        <div class="background rounded-lg p-6 border border-gray-800">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium opacity-70">Total Votes</h3>
            <ThumbsUp class="h-5 w-5 text-blue-500" />
          </div>
          <div class="mt-4">
            <p class="text-4xl font-bold">{{ totalVotes }}</p>
            <div class="mt-2 flex items-center text-sm space-x-3">
              <span class="text-green-500">↑{{ upvoteCount }}</span>
              <span class="text-red-500">↓{{ downvoteCount }}</span>
            </div>
          </div>
        </div>

        <!-- Accuracy Card -->
        <div class="background rounded-lg p-6 border border-gray-800">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium opacity-70">Accuracy Score</h3>
            <Star class="h-5 w-5 text-yellow-500" />
          </div>
          <div class="mt-4">
            <p class="text-4xl font-bold">{{ voteAccuracy }}%</p>
            <p class="mt-2 text-sm opacity-70">Aligned with consensus</p>
          </div>
        </div>

        <!-- Streak Card -->
        <div class="background rounded-lg p-6 border border-gray-800">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium opacity-70">Current Streak</h3>
            <Flame class="h-5 w-5 text-red-500" />
          </div>
          <div class="mt-4">
            <p class="text-4xl font-bold">{{ streakInfo.current }} days</p>
            <p class="mt-2 text-sm opacity-70"
              >Best: <span class="text-red-500">{{ streakInfo.best }} days</span></p
            >
          </div>
        </div>
      </div>

      <!-- Detailed Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Engagement Stats -->
        <div class="background rounded-lg p-6 border border-gray-800">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium opacity-70">Engagement Stats</h3>
            <Rocket class="h-5 w-5 text-purple-500" />
          </div>
          <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
              <span class="opacity-70">Upvoted Posts</span>
              <span class="text-lg font-medium text-green-500">{{ upvoteCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="opacity-70">Downvoted Posts</span>
              <span class="text-lg font-medium text-red-500">{{ downvoteCount }}</span>
            </div>
          </div>
        </div>

        <!-- Time Analysis -->
        <div class="background rounded-lg p-6 border border-gray-800">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium opacity-70">Time Analysis</h3>
            <Clock class="h-5 w-5 text-orange-500" />
          </div>
          <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center">
              <span class="opacity-70">Votes Today</span>
              <span class="text-lg font-medium">{{ todayVoteCount }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="opacity-70">Current Streak</span>
              <span class="text-lg font-medium text-red-500">{{ streakInfo.current }} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
