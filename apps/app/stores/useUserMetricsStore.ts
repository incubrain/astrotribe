import { defineStore } from 'pinia'

type UserMetrics = {
  votes: any[]
  streakData: any[]
  votesByDate: Record<string, any[]>
  achievements?: Record<string, Record<string, boolean>>
  current_level?: number
  current_xp?: number
  xp_to_next_level?: number
  total_votes?: number
  upvote_count?: number
  downvote_count?: number
  vote_accuracy?: number
  current_streak?: number
  best_streak?: number
}

const defaultMetrics: UserMetrics = {
  votes: [],
  streakData: [],
  votesByDate: {},
}

export const useUserMetricsStore = defineStore('metrics', () => {
  const metrics = ref<UserMetrics>({ ...defaultMetrics })
  const isLoading = ref(true)
  const error = ref(null)

  const currentLevel = computed(() => metrics.value.current_level || 0)

  const levelProgress = computed(() => {
    const { current_xp = 0, xp_to_next_level = 1 } = metrics.value
    return Math.round((current_xp / xp_to_next_level) * 100)
  })

  const totalVotes = computed(() => metrics.value.total_votes || metrics.value.votes.length || 0)
  const upvoteCount = computed(
    () => metrics.value.votes.filter((v: any) => v.vote_type === 1).length,
  )
  const downvoteCount = computed(
    () => metrics.value.votes.filter((v: any) => v.vote_type === -1).length,
  )

  const todayVoteCount = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return metrics.value.votesByDate?.[today]?.length ?? 0
  })

  const voteAccuracy = computed(() => metrics.value.vote_accuracy || 0)

  const remainingDailyVotes = computed(() => Math.max(10 - todayVoteCount.value, 0))
  const dailyProgress = computed(() => (todayVoteCount.value / 10) * 100)

  const currentStreak = computed(() => metrics.value.current_streak || 0)
  const bestStreak = computed(() => metrics.value.best_streak || 0)

  const achievementStats = computed(() => {
    const achievements = metrics.value.achievements
    if (!achievements) return { completed: 0, total: 0 }

    let completed = 0
    let total = 0

    Object.values(achievements).forEach((category) => {
      Object.values(category).forEach((achieved) => {
        total++
        if (achieved) completed++
      })
    })

    return { completed, total }
  })

  const recentAchievements = computed(() => {
    const achievements = metrics.value.achievements
    if (!achievements) return []

    return Object.entries(achievements)
      .flatMap(([category, items]) =>
        Object.entries(items).map(([name, achieved]) => ({
          category,
          name,
          achieved,
        })),
      )
      .filter((a) => a.achieved)
      .slice(0, 3)
  })

  async function fetchMetrics() {
    try {
      isLoading.value = true
      const data = await $fetch('/api/users/metrics')
      metrics.value = { ...defaultMetrics, ...data }
    } catch (err) {
      error.value = err
      console.error('Error fetching metrics:', err)
    } finally {
      isLoading.value = false
    }
  }

  function init() {
    fetchMetrics()
  }

  async function trackSourceVisit(sourceUrl: string, timeSpent: number) {
    const response = await $fetch('/api/users/metrics/track-source-visit', {
      method: 'POST',
      body: { sourceUrl, timeSpent },
    })
    metrics.value = { ...defaultMetrics, ...response }
    return response
  }

  async function updateTitle(title: string) {
    const response = await $fetch('/api/users/metrics/update-title', {
      method: 'POST',
      body: { title },
    })
    metrics.value = { ...defaultMetrics, ...response }
    return response
  }

  const trackNewsVisit = (newsId: string) => {
    const startTime = Date.now()
    return async () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      const response = await $fetch('/api/users/metrics/track-source-visit', {
        method: 'POST',
        body: { newsId, timeSpent },
      })
      metrics.value = { ...defaultMetrics, ...response }
      return response
    }
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
