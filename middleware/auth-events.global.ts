import { SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware((to, from) => {
  const { $router, $supabase } = useNuxtApp()
  const client: SupabaseClient = $supabase.client
  const auth = useAuthStore()

  client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event === 'PASSWORD_RECOVERY') {
      $router.push('/auth/reset-password') // Redirect to password recovery page
    }

    if (event === 'SIGNED_OUT') {
      $router.push('/auth/login') // Redirect to login page
    }

    if (session) {
      if (event === 'SIGNED_IN') {
        auth.updateSession(session)
        // Redirect to a protected area
      }

      if (event === 'TOKEN_REFRESHED') {
        auth.updateSession(session) // Update token in the store
      }

      if (event === 'USER_UPDATED') {
        auth.updateSession(session) // Update user data in the store
      }
    }
  })
})
