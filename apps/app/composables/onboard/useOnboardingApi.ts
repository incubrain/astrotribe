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
      const data = await $fetch('/api/onboard/status')

      return {
        completed: data?.completed || false,
        currentStep: data?.currentStep || 1,
        user_type: data?.user_type || null,
      }
    } catch (err: any) {
      console.error('Error checking onboarding status:', err)
      error.value = err.message || 'Failed to check onboarding status'
      return { completed: false, currentStep: 1, user_type: null }
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
      await $fetch('/api/onboard/step', {
        method: 'POST',
        body: {
          step,
          data,
        },
      })

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
      await $fetch('/api/onboard/complete', {
        method: 'POST',
        body: {
          ...allData,
          completed: true,
        },
      })

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
      const data = await $fetch('/api/onboard/data')

      return data || {}
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
      await $fetch('/api/user/profile', {
        method: 'PATCH',
        body: {
          [field]: value,
        },
      })

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

// API interactions
// async function checkOnboardingStatus() {
//   try {
//     isLoading.value = true
//     error.value = null

//     const { data } = await useFetch('/api/onboard/status')
//     const completed = data.value?.completed || false

//     isComplete.value = completed
//     return completed
//   } catch (err: any) {
//     console.error('Failed to check onboarding status', err)
//     error.value = err.message || 'Failed to check onboarding status'
//     return false
//   } finally {
//     isLoading.value = false
//   }
// }

// async function completeOnboarding() {
//   try {
//     isLoading.value = true
//     error.value = null

//     // Add timeout and retry logic
//     const response = await $fetch('/api/onboard/complete', {
//       method: 'POST',
//       body: {
//         ...stepData,
//         completed: true,
//       },
//       retry: 3,
//       retryDelay: 1000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 10000, // 10 second timeout
//     })

//     isComplete.value = true

//     // Clear localStorage since onboarding is complete
//     localStorage.removeItem('onboarding_state')

//     return true
//   } catch (err: any) {
//     console.error('Failed to complete onboarding', err)

//     // Add more detailed error information
//     if (err.response) {
//       console.error('Response status:', err.response.status)
//       console.error('Response data:', err.response.data)
//     }
//     error.value = err.message || 'Failed to complete onboarding'
//     return false
//   } finally {
//     isLoading.value = false
//   }
// }
