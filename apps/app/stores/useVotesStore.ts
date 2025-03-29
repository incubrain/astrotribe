// stores/useVotesStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface VoteResponse {
  success: boolean
  action: 'voted' | 'removed'
}

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

export const useVotesStore = defineStore('votes', () => {
  // Original vote store state
  const votes = ref<Record<string, number>>({})
  const userVotes = ref<Record<string, number>>({})
  const pendingVotes = ref<Record<string, Promise<VoteResponse>>>({})
  const { execute: executeOptimistic } = useOptimisticUpdate()

  // Metrics state
  const metrics = ref<VoteMetrics | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Original getters
  const getVoteType = computed(() => {
    return (contentId: string): number | null => userVotes.value[contentId] ?? null
  })

  const getScore = computed(() => {
    return (contentId: string): number | null => votes.value[contentId] ?? null
  })

  const isVotePending = computed(() => {
    return (contentId: string): boolean => !!pendingVotes.value[contentId]
  })

  // Metrics getters
  const totalVotes = computed(() => metrics.value?.votes.length ?? 0)

  const upvoteCount = computed(
    () => metrics.value?.votes.filter((v) => v.vote_type === 1).length ?? 0,
  )

  const downvoteCount = computed(
    () => metrics.value?.votes.filter((v) => v.vote_type === -1).length ?? 0,
  )

  const voteAccuracy = computed(() => {
    if (!metrics.value?.votes.length) return 0

    const alignedVotes = metrics.value.votes.filter((vote) => {
      if (vote.news_score === 0) return true
      return (
        (vote.news_score > 0 && vote.vote_type === 1) ||
        (vote.news_score < 0 && vote.vote_type === -1)
      )
    })

    return Math.round((alignedVotes.length / metrics.value.votes.length) * 100)
  })

  const streakInfo = computed(() => {
    if (!metrics.value?.votesByDate) return { current: 0, best: 0 }

    const dates = Object.keys(metrics.value.votesByDate).sort()
    if (!dates.length) return { current: 0, best: 0 }

    let currentStreak = 0
    let bestStreak = 0

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (metrics.value.votesByDate[today]) {
      currentStreak = 1
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

    return { current: currentStreak, best: bestStreak }
  })

  const todayVoteCount = computed(() => {
    if (!metrics.value?.votesByDate) return 0
    const today = new Date().toISOString().split('T')[0]
    return metrics.value.votesByDate[today]?.length ?? 0
  })

  // User votes tracking
  const fetchUserVotes = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      // Updated to get votes for all content types from content_interactions
      const response = await $fetch('/api/votes/user')
      userVotes.value = response.votes
    } catch (err) {
      console.error('Error fetching votes:', err)
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchVotedPosts = async (voteType: 1 | -1) => {
    try {
      // Get voted posts for specific vote type
      const response = await $fetch(`/api/votes/user/${voteType}`)
      return response
    } catch (err) {
      console.error('Error fetching voted posts:', err)
      error.value = err as Error
      throw err
    }
  }

  const setVotes = (contentId: string, score: number) => {
    votes.value[contentId] = score
  }

  const submitVote = async (contentId: string, voteType: number, contentType: string = 'news') => {
    if (pendingVotes.value[contentId]) {
      return
    }

    const currentVote = getVoteType.value(contentId)
    const isRemoving = currentVote === voteType
    const oldVote = currentVote
    const oldScore = votes.value[contentId]

    return executeOptimistic({
      // Use contentId as key to prevent duplicate votes
      key: contentId,

      // Define API call
      apiCall: () =>
        $fetch(`/api/votes/${contentType}/${contentId}`, { method: 'POST', body: { voteType } }),

      // Optimistic update function
      optimisticUpdate: () => {
        // Update user vote
        userVotes.value = { ...userVotes.value, [contentId]: isRemoving ? null : voteType }

        // Update score
        const change = isRemoving ? -voteType : oldVote ? voteType * 2 : voteType
        votes.value = { ...votes.value, [contentId]: votes.value[contentId] + change }

        return { success: true, change }
      },

      // Rollback function
      rollback: () => {
        userVotes.value = { ...userVotes.value, [contentId]: oldVote }
        votes.value = { ...votes.value, [contentId]: oldScore }
      },
    })
  }

  // User metrics
  const fetchMetrics = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      // Get metrics using the updated endpoint that works with content_interactions
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
    // State
    votes,
    userVotes,
    isLoading,
    error,

    // Original getters
    getScore,
    getVoteType,
    isVotePending,

    // Metrics getters
    totalVotes,
    upvoteCount,
    downvoteCount,
    voteAccuracy,
    streakInfo,
    todayVoteCount,

    // Original actions
    setVotes,
    fetchUserVotes,
    submitVote,
    fetchVotedPosts,

    // New metrics action
    fetchMetrics,
  }
})
