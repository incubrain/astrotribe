import { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $supabase } = useNuxtApp()
  const client: SupabaseClient = $supabase.client
  const auth = useAuthStore()

  // if the user is authenticated, don't do anything
  console.log('auth.isAuthenticated', auth.isAuthenticated)
  if (auth.isAuthenticated) return

  // if no tokens and protectd route, navigate to login
  if (!auth.hasTokens && auth.isProtectedRoute(to.fullPath)) {
    console.log('No tokens, navigate to login')
    return navigateTo('/auth/login')
  }

  // handle first time login
  if (auth.isFirstLogin) {
    console.log('first login, setSession')
    await auth.setSession(client)
    return navigateTo('/astrotribe')
  }

  // if the cookie session has NOT expired, set the session
  if (!auth.hasSessionExpired) {
    console.log('Session available, call setSession')
    await auth.setSession(client)
    return
  }

  // finally, if no session cookies exists, force user to login
  if (!auth.isAuthenticated && auth.isProtectedRoute(to.fullPath)) {
    console.log('No session, navigate to login')
    return navigateTo('/auth/login')
  }
})
