// composables/useFeatureSurvey.ts
export function useFeatureSurvey() {
  const { $posthog } = useNuxtApp()
  const survey = ref(null)
  const response = ref('')
  const isLoading = ref(true)
  const isSubmitted = ref(false)

  // Track feature request interactions
  const trackSurveyInteraction = (action: 'shown' | 'submitted' | 'dismissed', properties = {}) => {
    $posthog.capture(`feature_survey_${action}`, {
      location: 'homepage',
      ...properties,
    })
  }

  const closeSurvey = () => {
    if (survey.value) {
      localStorage.setItem(`featureSurvey_${survey.value.id}`, 'true')
      survey.value = null
    }
  }

  const submitSurvey = async () => {
    if (!survey.value || !response.value.trim()) return

    trackSurveyInteraction('submitted', {
      response: response.value,
    })

    // You might want to also store this in your database
    await $posthog.capture('feature_request', {
      request: response.value,
      priority: 'user_submitted',
    })

    isSubmitted.value = true
    response.value = ''
    setTimeout(() => {
      closeSurvey()
      isSubmitted.value = false
    }, 3000)
  }

  const dismissSurvey = () => {
    trackSurveyInteraction('dismissed')
    closeSurvey()
  }

  onMounted(() => {
    // Check if user has already submitted a feature request recently
    const lastSubmission = localStorage.getItem('lastFeatureRequest')
    const cooldownPeriod = 7 * 24 * 60 * 60 * 1000 // 7 days

    if (lastSubmission && Date.now() - parseInt(lastSubmission) < cooldownPeriod) {
      isLoading.value = false
      return
    }

    // Create our own survey object instead of fetching from PostHog
    survey.value = {
      id: 'feature-request-' + Date.now(),
      name: 'Feature Request',
      questions: [
        {
          question: 'What features would you like to see in AstroTribe?',
        },
      ],
    }

    trackSurveyInteraction('shown')
    isLoading.value = false
  })

  return {
    survey,
    response,
    isLoading,
    isSubmitted,
    submitSurvey,
    dismissSurvey,
  }
}
