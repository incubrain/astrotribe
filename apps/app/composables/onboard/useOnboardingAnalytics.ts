/**
 * Composable for tracking onboarding-related analytics events
 */
export function useOnboardingAnalytics() {
  /**
   * Tracks when a user views an onboarding step
   */
  function trackStepView(step: number, stepName: string) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('onboarding_step_view', {
          step_number: step,
          step_name: stepName,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking step view:', error)
    }
  }

  /**
   * Tracks when a user completes an onboarding step
   */
  function trackStepComplete(step: number, stepName: string, data: any) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('onboarding_step_complete', {
          step_number: step,
          step_name: stepName,
          data_points: Object.keys(data).length,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking step completion:', error)
    }
  }

  /**
   * Tracks when a user selects an interest category
   */
  function trackInterestSelect(
    categoryId: string,
    categoryName: string,
    action: 'select' | 'deselect' = 'select',
  ) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('interest_select', {
          category_id: categoryId,
          category_name: categoryName,
          action,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking interest selection:', error)
    }
  }

  /**
   * Tracks when a user selects a feature interest
   */
  function trackFeatureInterestClick(
    featureId: string,
    featureTitle: string,
    action: 'select' | 'deselect' = 'select',
  ) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('feature_interest_click', {
          feature_id: featureId,
          feature_title: featureTitle,
          action,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking feature interest click:', error)
    }
  }

  /**
   * Tracks when a user selects a topic tag
   */
  function trackTopicSelect(
    tagId: string,
    tagName: string,
    action: 'select' | 'deselect' = 'select',
  ) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('topic_select', {
          tag_id: tagId,
          tag_name: tagName,
          action,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking topic selection:', error)
    }
  }

  /**
   * Tracks when a user completes the entire onboarding flow
   */
  function trackOnboardingComplete(data: any) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('onboarding_completed', {
          steps_completed: Object.keys(data).length,
          user_type: data.user_types,
          has_interests: Array.isArray(data.interests) && data.interests.length > 0,
          has_topics: Array.isArray(data.topics) && data.topics.length > 0,
          has_features: Array.isArray(data.feature_interests) && data.feature_interests.length > 0,
          has_location: !!data.location && Object.keys(data.location).length > 0,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking onboarding completion:', error)
    }
  }

  /**
   * Tracks if a user abandons the onboarding flow
   */
  function trackOnboardingDrop(lastCompletedStep: number, lastStepName: string) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('onboarding_drop_off', {
          last_completed_step: lastCompletedStep,
          last_step_name: lastStepName,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking onboarding drop-off:', error)
    }
  }

  /**
   * Tracks when user performs a location search
   */
  function trackLocationSearch(countryId: string, countryName: string, searchQuery?: string) {
    if (!import.meta.client) return

    try {
      if (window.posthog) {
        window.posthog.capture('location_search', {
          country_id: countryId,
          country_name: countryName,
          search_query: searchQuery,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error tracking location search:', error)
    }
  }

  return {
    trackStepView,
    trackStepComplete,
    trackInterestSelect,
    trackFeatureInterestClick,
    trackTopicSelect,
    trackOnboardingComplete,
    trackOnboardingDrop,
    trackLocationSearch,
  }
}
