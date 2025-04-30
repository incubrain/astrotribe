// stores/useFeatureRequestStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface FeatureRequest {
  id: string
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'completed'
  upvotes: number
  downvotes: number
  priority_score: number
  engagement_score: number
}

export const useFeatureRequestStore = defineStore('features', () => {
  // State
  const features = ref<FeatureRequest[]>([])
  const hiddenFeatureIds = ref(new Set<string>())
  const userVotes = ref(new Map<string, 1 | -1>())
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Getters
  const visibleFeatures = computed(() => {
    return features.value.filter((feature) => !hiddenFeatureIds.value.has(feature.id)).slice(0, 3)
  })

  const hasMoreFeatures = computed(() => {
    return features.value.filter((f) => !hiddenFeatureIds.value.has(f.id)).length > 3
  })

  const getFeatureVote = (featureId: string) => {
    return userVotes.value.get(featureId) || 0
  }

  // Actions
  async function fetchFeatures() {
    isLoading.value = true
    try {
      const { data } = await useSupabaseClient()
        .from('feature_requests')
        .select('*')
        .order('priority_score', { ascending: true })
        .limit(10)

      features.value = data || []

      // Also fetch user's votes
      await fetchUserVotes()
    } catch (error: any) {
      console.error('Error fetching features:', error)
      error.value = error as Error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserVotes() {
    const {
      data: { user },
    } = await useSupabaseClient().auth.getUser()
    if (!user) return

    const { data } = await useSupabaseClient()
      .from('feature_engagements')
      .select('feature_id, engagement_type')
      .eq('user_id', user.id)
      .in('engagement_type', ['vote_up', 'vote_down'])

    if (data) {
      userVotes.value = new Map(data.map((vote) => [vote.feature_id, vote.engagement_type]))
    }
  }

  async function voteOnFeature(featureId: string, voteType: 1 | -1, feedback?: string) {
    const {
      data: { user },
    } = await useSupabaseClient().auth.getUser()
    if (!user) return

    const { error } = await useSupabaseClient().from('feature_votes').upsert({
      feature_id: featureId,
      user_id: user.id,
      vote_type: voteType,
      feedback,
    })

    if (!error) {
      userVotes.value.set(featureId, voteType)
      hideFeature(featureId)
      await fetchFeatures() // Refresh features to get updated scores
    }
  }

  function hideFeature(featureId: string) {
    hiddenFeatureIds.value.add(featureId)
  }

  return {
    // State
    features,
    isLoading,
    error,

    // Getters
    visibleFeatures,
    hasMoreFeatures,
    getFeatureVote,

    // Actions
    fetchFeatures,
    voteOnFeature,
    hideFeature,
  }
})
