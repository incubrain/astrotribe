// middleware/5.onboarding.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip for public pages, auth callback and reset password
  if (to.meta.isPublic || to.meta.isCallback || to.meta.isResetPassword) {
    return
  }

  // Skip for onboarding routes
  if (to.path.startsWith('/onboarding')) {
    return
  }

  const logger = useLogger('onboarding-middleware')
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  try {
    // Check if user is authenticated
    if (!user.value) {
      logger.debug('User not authenticated, skipping onboarding check')
      return
    }

    // Check if user has completed onboarding
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', user.value.id)
      .single()

    if (error) {
      logger.error('Error fetching profile', { error })
      return
    }

    // If onboarding is not completed, redirect to onboarding
    if (profile && profile.onboarding_completed === false) {
      logger.info('User has not completed onboarding, redirecting')
      return navigateTo('/onboarding')
    }
  } catch (error: any) {
    logger.error('Error in onboarding middleware', { error })
  }
})
