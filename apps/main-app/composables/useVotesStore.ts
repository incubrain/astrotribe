// stores/useVoteStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface VoteMetrics {
  votes: Array<{
    id: string
    content_id: string
    vote_type: number
    created_at: string
    news_score: number
  }>
  votesByDate: Record<string, any[]>
  streakData: any[]
}

export const useVoteStore = defineStore('votes', () => {
  // State
  const metrics = ref<VoteMetrics | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Basic Metrics
  const totalVotes = computed(() => metrics.value?.votes.length ?? 0)

  const upvoteCount = computed(
    () => metrics.value?.votes.filter((v) => v.vote_type === 1).length ?? 0,
  )

  const downvoteCount = computed(
    () => metrics.value?.votes.filter((v) => v.vote_type === -1).length ?? 0,
  )

  // Accuracy calculation based on alignment with news scores
  const voteAccuracy = computed(() => {
    if (!metrics.value?.votes.length) return 0

    const alignedVotes = metrics.value.votes.filter((vote) => {
      if (vote.news_score === 0) return true // Neutral articles don't affect accuracy
      return (
        (vote.news_score > 0 && vote.vote_type === 1) ||
        (vote.news_score < 0 && vote.vote_type === -1)
      )
    })

    return Math.round((alignedVotes.length / metrics.value.votes.length) * 100)
  })

  // Streak Calculations
  const streakInfo = computed(() => {
    if (!metrics.value?.votesByDate) return { current: 0, best: 0 }

    const dates = Object.keys(metrics.value.votesByDate).sort()
    if (!dates.length) return { current: 0, best: 0 }

    let currentStreak = 0
    let bestStreak = 0

    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Check if voted today
    if (metrics.value.votesByDate[today]) {
      currentStreak = 1
      // Check previous days
      let checkDate = new Date(Date.now() - 86400000)

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0]
        if (metrics.value.votesByDate[dateStr]) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 86400000)
        } else {
          break
        }
      }
    } else if (metrics.value.votesByDate[yesterday]) {
      // If not voted today, check streak up to yesterday
      currentStreak = 1
      let checkDate = new Date(Date.now() - 2 * 86400000)

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0]
        if (metrics.value.votesByDate[dateStr]) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 86400000)
        } else {
          break
        }
      }
    }

    // Calculate best streak
    let tempStreak = 0
    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i])
      const nextDate = i < dates.length - 1 ? new Date(dates[i + 1]) : null

      if (!tempStreak) tempStreak = 1
      else if (nextDate) {
        const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / 86400000)
        if (daysDiff === 1) tempStreak++
        else {
          bestStreak = Math.max(bestStreak, tempStreak)
          tempStreak = 1
        }
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak, currentStreak)

    return {
      current: currentStreak,
      best: bestStreak,
    }
  })

  const todayVoteCount = computed(() => {
    if (!metrics.value?.votesByDate) return 0
    const today = new Date().toISOString().split('T')[0]
    return metrics.value.votesByDate[today]?.length ?? 0
  })

  // Fetch metrics action
  const fetchMetrics = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/users/metrics')
      metrics.value = response as VoteMetrics
    } catch (err) {
      console.error('Error fetching metrics:', err)
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    totalVotes,
    upvoteCount,
    downvoteCount,
    voteAccuracy,
    streakInfo,
    todayVoteCount,
    fetchMetrics,
  }
})
