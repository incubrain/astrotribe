// stores/useVoteStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface VoteResponse {
  success: boolean
  action: 'voted' | 'removed'
}

export const useVoteStore = defineStore('votes', () => {
  // State
  const votes = ref<Record<string, number>>({})
  const pendingVotes = ref<Record<string, Promise<VoteResponse>>>({})
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Getters
  const getVoteType = computed(() => {
    return (contentId: string): number | null => votes.value[contentId] || null
  })

  const isVotePending = computed(() => {
    return (contentId: string): boolean => !!pendingVotes.value[contentId]
  })

  // Actions
  const fetchUserVotes = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/votes/user')
      votes.value = response.votes
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
      const response = await $fetch(`/api/votes/user/${voteType}`)
      return response
    } catch (err) {
      console.error('Error fetching voted posts:', err)
      error.value = err as Error
      throw err
    }
  }

  const submitVote = async (
    contentId: string,
    voteType: number,
    { success: successNotify, error: errorNotify }: ReturnType<typeof useNotification>,
  ) => {
    // Check for pending vote
    if (pendingVotes.value[contentId]) {
      return
    }

    const currentVote = getVoteType.value(contentId)
    const isRemoving = currentVote === voteType
    const oldVote = currentVote

    try {
      // Create the vote promise
      pendingVotes.value[contentId] = $fetch(`/api/votes/news/${contentId}`, {
        method: 'POST',
        body: { voteType },
      })

      // Optimistically update UI
      votes.value = {
        ...votes.value,
        [contentId]: isRemoving ? null : voteType,
      }

      // Wait for the response
      const response = await pendingVotes.value[contentId]

      // Show success notification
      successNotify({
        summary: 'Vote Recorded',
        message: `Successfully ${response.action === 'removed' ? 'removed vote' : 'voted'}`,
      })

      // Calculate score change
      let change = 0
      if (isRemoving) {
        change = -voteType
      } else {
        change = oldVote ? voteType * 2 : voteType
      }

      return { success: true, change }
    } catch (err: any) {
      // Revert optimistic update
      votes.value = {
        ...votes.value,
        [contentId]: oldVote,
      }

      // Handle specific error cases
      if (err.statusCode === 401) {
        errorNotify({
          summary: 'Authentication Required',
          message: 'Please log in to vote',
        })
      } else {
        errorNotify({
          summary: 'Vote Failed',
          message: 'Unable to record your vote. Please try again.',
        })
      }

      throw err
    } finally {
      // Clean up pending vote
      delete pendingVotes.value[contentId]
    }
  }

  return {
    // State
    votes,
    isLoading,
    error,

    // Getters
    getVoteType,
    isVotePending,

    // Actions
    fetchUserVotes,
    submitVote,
    fetchVotedPosts, // Added this to the returned object
  }
})
