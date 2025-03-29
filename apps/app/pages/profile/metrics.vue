<!-- UserMetricsDashboard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const voteStore = useVotesStore()
const {
  isLoading,
  totalVotes,
  upvoteCount,
  downvoteCount,
  voteAccuracy,
  streakInfo,
  todayVoteCount,
} = storeToRefs(voteStore)

// Calculate level based on total votes
const currentLevel = computed(() => Math.floor(totalVotes.value / 10))
const levelProgress = computed(() => (totalVotes.value % 10) * 10)

// Circular progress calculations
const radius = 30
const circumference = 2 * Math.PI * radius
const progressOffset = computed(() => ((100 - levelProgress.value) / 100) * circumference)

onMounted(async () => {
  await voteStore.fetchMetrics()
})
</script>

<template>
  <div class="p-6 min-h-screen bg-gradient-to-br">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center h-64"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <!-- Level Banner -->
      <div
        class="foreground rounded-xl p-4 border-4 border-blue-500/20 bg-blue-500/5 shadow-lg shadow-blue-500/10"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold flex items-center gap-2">
              <Icon
                size="34px"
                name="game-icons:star-medal"
                class="h-6 w-6 text-yellow-400"
              />
              Level {{ currentLevel }}
            </h2>
            <p class="text-sm opacity-70">Vote Master</p>
          </div>
          <!-- Custom Circular Progress -->
          <div class="relative w-20 h-20">
            <svg class="w-full h-full -rotate-90 transform">
              <circle
                cx="40"
                cy="40"
                :r="radius"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                class="text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                :r="radius"
                stroke="currentColor"
                stroke-width="4"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                class="text-blue-500 transition-all duration-500"
              />
            </svg>
            <div
              class="absolute inset-0 flex items-center justify-center text-blue-500 font-semibold"
            >
              {{ levelProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Votes Trophy Card -->
        <div
          class="foreground rounded-xl p-6 border-4 border-yellow-500/20 bg-yellow-500/5 shadow-lg shadow-yellow-500/10"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium opacity-70">Total Votes</h3>
              <p class="text-4xl font-bold mt-2">{{ totalVotes }}</p>
            </div>
            <Icon
              size="34px"
              name="game-icons:trophy"
              class="h-10 w-10 text-yellow-400"
            />
          </div>
          <div class="mt-4 flex gap-4">
            <span class="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              ↑{{ upvoteCount }}
            </span>
            <span class="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
              ↓{{ downvoteCount }}
            </span>
          </div>
        </div>

        <!-- Accuracy Card -->
        <div
          class="foreground rounded-xl p-6 border-4 border-purple-500/20 bg-purple-500/5 shadow-lg shadow-purple-500/10"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium opacity-70">Accuracy</h3>
              <p class="text-4xl font-bold mt-2">{{ voteAccuracy }}%</p>
            </div>
            <Icon
              size="34px"
              name="game-icons:bullseye"
              class="h-10 w-10 text-purple-400"
            />
          </div>
          <div class="mt-4">
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-purple-400 rounded-full transition-all duration-500"
                :style="{ width: `${voteAccuracy}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Streak Card -->
        <div
          class="foreground rounded-xl p-6 border-4 border-orange-500/20 bg-orange-500/5 shadow-lg shadow-orange-500/10"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-medium opacity-70">Streak</h3>
              <p class="text-4xl font-bold mt-2">{{ streakInfo.current }}</p>
            </div>
            <Icon
              size="34px"
              name="game-icons:fire-dash"
              class="h-10 w-10 text-orange-400"
            />
          </div>
          <p class="mt-4 text-sm">
            Best: <span class="text-orange-400">{{ streakInfo.best }} days</span>
          </p>
        </div>
      </div>

      <!-- Achievement Section -->
      <div
        class="foreground rounded-xl p-6 border-4 border-green-500/20 bg-green-500/5 shadow-lg shadow-green-500/10"
      >
        <div class="flex items-center gap-2 mb-4">
          <Icon
            size="34px"
            name="game-icons:laurels-trophy"
            class="h-8 w-8 text-green-400"
          />
          <h3 class="text-lg font-semibold">Today's Progress</h3>
        </div>
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <p class="text-sm opacity-70">Votes Today: {{ todayVoteCount }}/10</p>
            <div class="h-2 w-48 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-400 rounded-full transition-all duration-500"
                :style="{ width: `${(todayVoteCount / 10) * 100}%` }"
              />
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-70">Daily Goal</p>
            <p class="text-lg font-semibold text-green-400">{{ 10 - todayVoteCount }} more</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
