// stores/useMetricsStore.ts
import { defineStore } from 'pinia'

export const useUserMetricsStore = defineStore('metrics', () => {
  const metrics = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  // Computed values from metrics
  const currentLevel = computed(() => metrics.value?.current_level || 0)
  const levelProgress = computed(() => {
    if (!metrics.value) return 0
    const { current_xp, xp_to_next_level } = metrics.value
    return Math.round((current_xp / xp_to_next_level) * 100)
  })

  const totalVotes = computed(() => metrics.value?.total_votes || 0)
  const upvoteCount = computed(() => metrics.value?.upvote_count || 0)
  const downvoteCount = computed(() => metrics.value?.downvote_count || 0)
  const todayVoteCount = computed(() => metrics.value?.today_activity.votes.length || 0)
  const voteAccuracy = computed(() => metrics.value?.vote_accuracy || 0)

  const remainingDailyVotes = computed(() => 10 - todayVoteCount.value)
  const dailyProgress = computed(() => (todayVoteCount.value / 10) * 100)

  // Streaks
  const currentStreak = computed(() => metrics.value?.current_streak || 0)
  const bestStreak = computed(() => metrics.value?.best_streak || 0)

  const achievementStats = computed(() => {
    if (!metrics.value?.achievements) return { completed: 0, total: 0 }

    let completed = 0
    let total = 0

    Object.values(metrics.value.achievements).forEach((category) => {
      Object.values(category as Record<string, boolean>).forEach((achieved) => {
        total++
        if (achieved) completed++
      })
    })

    return { completed, total }
  })

  const recentAchievements = computed(() => {
    if (!metrics.value?.achievements) return []

    const achievements: { category: string; name: string; achieved: boolean }[] = []

    Object.entries(metrics.value.achievements).forEach(([category, items]) => {
      Object.entries(items as Record<string, boolean>).forEach(([name, achieved]) => {
        achievements.push({ category, name, achieved })
      })
    })

    return achievements.filter((a) => a.achieved).slice(0, 3)
  })

  // Actions
  async function fetchMetrics() {
    try {
      isLoading.value = true
      const data = await $fetch('/api/users/metrics/get')
      metrics.value = data
    } catch (err) {
      error.value = err
      console.error('Error fetching metrics:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function trackSourceVisit(sourceUrl: string, timeSpent: number) {
    const response = await $fetch('/api/users/metrics/track-source-visit', {
      method: 'POST',
      body: { sourceUrl, timeSpent },
    })
    metrics.value = response // Update store with new metrics
    return response
  }

  async function updateTitle(title: string) {
    const response = await $fetch('/api/users/metrics/update-title', {
      method: 'POST',
      body: { title },
    })
    metrics.value = response // Update store with new metrics
    return response
  }

  const trackNewsVisit = async (newsId: string) => {
    const startTime = Date.now()
    return async () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const response = await $fetch('/api/users/metrics/track-source-visit', {
        method: 'POST',
        body: { newsId, timeSpent },
      })
      metrics.value = response // Update store with new metrics
      return response
    }
  }

  // Initialize metrics when store is created
  function init() {
    fetchMetrics()
  }

  return {
    // State
    metrics,
    isLoading,
    error,

    // Getters
    currentLevel,
    levelProgress,
    totalVotes,
    upvoteCount,
    downvoteCount,
    todayVoteCount,
    voteAccuracy,
    remainingDailyVotes,
    dailyProgress,
    currentStreak,
    bestStreak,
    achievementStats,
    recentAchievements,

    // Actions
    init,
    fetchMetrics,
    trackSourceVisit,
    updateTitle,
    trackNewsVisit,
  }
})
