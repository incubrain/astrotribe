import { ref } from 'vue'

export function useOnboardingApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Check if user has already completed onboarding
   */
  async function checkOnboardingStatus() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch('/api/onboard/status')

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to check onboarding status')
      }

      return {
        completed: data.value?.completed || false,
        currentStep: data.value?.currentStep || 1,
        userType: data.value?.userType || null,
      }
    } catch (err: any) {
      console.error('Error checking onboarding status:', err)
      error.value = err.message || 'Failed to check onboarding status'
      return { completed: false, currentStep: 1, userType: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Save data for a specific onboarding step
   */
  async function saveStepData(step: number, data: any) {
    isLoading.value = true
    error.value = null

    try {
      const { error: fetchError } = await useFetch('/api/onboard/step', {
        method: 'POST',
        body: {
          step,
          data,
        },
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to save step data')
      }

      return true
    } catch (err: any) {
      console.error(`Error saving data for step ${step}:`, err)
      error.value = err.message || 'Failed to save step data'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Complete the onboarding process
   */
  async function completeOnboarding(allData: any) {
    isLoading.value = true
    error.value = null

    try {
      const { error: fetchError } = await useFetch('/api/onboard/complete', {
        method: 'POST',
        body: {
          ...allData,
          completed: true,
        },
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to complete onboarding')
      }

      return true
    } catch (err: any) {
      console.error('Error completing onboarding:', err)
      error.value = err.message || 'Failed to complete onboarding'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch user's current onboarding data
   */
  async function fetchCurrentOnboardingData() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch('/api/onboard/data')

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to fetch onboarding data')
      }

      return data.value || {}
    } catch (err: any) {
      console.error('Error fetching onboarding data:', err)
      error.value = err.message || 'Failed to fetch onboarding data'
      return {}
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update user profile for a specific field
   */
  async function updateUserProfile(field: string, value: any) {
    isLoading.value = true
    error.value = null

    try {
      const { error: fetchError } = await useFetch('/api/user/profile', {
        method: 'PATCH',
        body: {
          [field]: value,
        },
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Failed to update user profile')
      }

      return true
    } catch (err: any) {
      console.error(`Error updating user profile field ${field}:`, err)
      error.value = err.message || 'Failed to update user profile'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    checkOnboardingStatus,
    saveStepData,
    completeOnboarding,
    fetchCurrentOnboardingData,
    updateUserProfile,
  }
}
