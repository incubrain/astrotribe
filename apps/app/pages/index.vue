<script setup lang="ts">
definePageMeta({
  name: 'AstroTribe',
})

const userStore = useCurrentUser()
const metricsStore = useUserMetricsStore()
const { profile } = storeToRefs(userStore)
const {
  isLoading,
  currentLevel,
  levelProgress,
  remainingDailyVotes,
  dailyProgress,
  currentStreak,
  downvoteCount,
  upvoteCount,
  todayVoteCount,
  totalVotes,
  voteAccuracy,
  achievementStats,
  recentAchievements,
} = storeToRefs(metricsStore)

// Initialize metrics
onMounted(() => {
  metricsStore.init()
})
</script>

<template>
  <div class="grid w-full min-h-screen gap-6 p-6">
    <!-- Welcome Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Welcome Card -->
      <div
        class="bg-gray-900/50 flex flex-col rounded-xl p-6 border border-gray-800 md:col-span-2 xl:col-span-3 xl:row-span-2"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Welcome {{ profile.given_name }} 👋</h1>
            <div
              class="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20"
            >
              <Icon
                name="game-icons:star-medal"
                class="text-blue-400"
              />
              <span class="text-blue-400 font-medium">Level {{ currentLevel }}</span>
            </div>
          </div>
          <FeatureRanking />
        </div>
      </div>
      <Feedback />

      <!-- Stats Grid -->
      <!-- <MetricStatCard
        title="Total Votes"
        :value="totalVotes"
        icon="game-icons:trophy"
        class="md:col-span-1"
        color="yellow"
        :loading="isLoading"
      >
        <template #footer>
          <div class="mt-4 flex gap-4">
            <span
              class="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400"
            >
              ↑{{ upvoteCount }}
            </span>
            <span
              class="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400"
            >
              ↓{{ downvoteCount }}
            </span>
          </div>
        </template>
      </MetricStatCard>
      <MetricStatCard
        title="Today's Progress"
        :value="`${todayVoteCount}/10`"
        icon="game-icons:laurels-trophy"
        color="green"
        class="md:col-span-1"
        :loading="isLoading"
      >
        <template #footer>
          <div class="mt-4 space-y-2">
            <MetricProgressBar
              :value="todayVoteCount"
              :max="10"
              color="green"
              :loading="isLoading"
            />
            <p class="text-sm text-gray-400">
              {{ remainingDailyVotes < 0 ? 0 : remainingDailyVotes }} votes remaining today
            </p>
          </div>
        </template>
      </MetricStatCard> -->

      <EventUpcomingLink class="xl:col-start-3 xl:row-start-3" />

      <!-- Achievements Section -->
      <!-- <div
        class="bg-gray-900/50 rounded-xl p-6 border border-gray-800 md:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:row-span-2"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Achievements</h3>
            <span class="text-sm text-gray-400">
              {{ achievementStats.completed }}/{{ achievementStats.total }}
            </span>
          </div>
          <div
            v-if="currentStreak > 0"
            class="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-lg border border-orange-500/20"
          >
            <Icon
              name="mdi:fire"
              class="text-orange-400"
            />
            <span class="text-orange-400 font-medium">{{ currentStreak }} Day Streak!</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="achievement in recentAchievements"
              :key="achievement.name"
              class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div class="p-2 bg-yellow-500/10 rounded-lg">
                <Icon
                  name="game-icons:medal"
                  class="text-yellow-400"
                />
              </div>
              <div>
                <h4 class="font-medium">{{ achievement.name }}</h4>
                <p class="text-sm text-gray-400">{{ achievement.category }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/achievements"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>View All Achievements</span>
            <Icon name="mdi:chevron-right" />
          </NuxtLink>
        </div>
      </div>
      -->
    </div>

    <!-- Bottom Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- <MetricLevelProgress
        :level="currentLevel"
        :progress="levelProgress"
        :loading="isLoading"
      />

      <MetricStatCard
        title="Vote Accuracy"
        :value="`${voteAccuracy}%`"
        icon="game-icons:bullseye"
        color="purple"
        :loading="isLoading"
      >
        <template #footer>
          <div class="mt-4">
            <MetricProgressBar
              :value="voteAccuracy"
              :max="100"
              color="purple"
              :loading="isLoading"
            />
          </div>
        </template>
      </MetricStatCard> -->
    </div>
  </div>
</template>

<style scoped></style>
