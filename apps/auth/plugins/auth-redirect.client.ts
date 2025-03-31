import { defineNuxtPlugin, navigateTo } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const { public: env } = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const logger = useLogger('auth-redirect')

  // Check onboarding status and redirect if needed
  async function checkOnboardingStatus() {
    try {
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        // Not logged in
        return
      }

      // Get user profile to check onboarding status
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', user.user.id)
        .single()

      if (error) {
        logger.error('Failed to fetch user profile', { error })
        return
      }

      // Redirect to onboarding if not completed
      if (profile && profile.onboarding_completed === false) {
        logger.info('Redirecting to onboarding')
        await navigateTo(`${env.appURL}/onboarding`, { external: true })
      } else {
        // Redirect to dashboard/home
        logger.info('Redirecting to dashboard')
        await navigateTo(env.appURL, { external: true })
      }
    } catch (error: any) {
      logger.error('Error checking onboarding status', { error })
    }
  }

  // Check auth state changes and redirect as needed
  supabase.auth.onAuthStateChange((event, session) => {
    logger.info('Auth state changed', { event, hasSession: !!session })

    if (event === 'SIGNED_IN') {
      // User has just signed in
      checkOnboardingStatus()
    } else if (event === 'SIGNED_OUT') {
      // User has signed out
      navigateTo('/login')
    }
  })

  return {
    provide: {
      checkOnboardingStatus,
    },
  }
})
