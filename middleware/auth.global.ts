export default defineNuxtRouteMiddleware(async (to, from) => {
  const admin = useTestingStore()
  const { settings } = storeToRefs(admin)

  if (!settings.value.authOn) {
    console.log('TEST_MODE: Auth Off')
    return
  }

  const auth = useAuthStore()

  // if the user is authenticated, don't do anything
  console.log('auth.isAuthenticated', auth.isAuthenticated, auth.hasTokens)
  if (auth.isAuthenticated) return

  // if no tokens and protectd route, navigate to login
  if (!auth.hasTokens && auth.isProtectedRoute(to.fullPath)) {
    console.log('No tokens, navigate to login')
    return navigateTo('/auth/login')
  }

  // handle first time login
  if (auth.isFirstLogin) {
    console.log('first login, setSession')
    await auth.setSession()
    return navigateTo('/astrotribe')
  }

  // if the cookie session has NOT expired, set the session
  if (!auth.hasSessionExpired) {
    console.log('Session available, call setSession')
    await auth.setSession()
    return
  }

  // finally, if no session cookies exists, force user to login
  if (!auth.isAuthenticated && auth.isProtectedRoute(to.fullPath)) {
    console.log('No session, navigate to login')
    return navigateTo('/auth/login')
  }
})
