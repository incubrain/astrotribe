// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const { aeAppUrl } = config.public
  const supabase = useSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/success', // For registration success page
  ]
  // Check if we're on a public route
  const isPublicRoute = publicRoutes.includes(to.path)
  // If there's an error or no session (user not logged in)

  if (error || !data.session) {
    console.log('USER_NOT_LOGGED_IN')
    console.log('ERROR', error)
    // Allow access to public routes

    if (isPublicRoute) {
      return
    }
    // Redirect to login for non-public routes
    return navigateTo('/login')
  }
  // User is logged in at this point
  console.log('USER_LOGGED_IN', data.session)
  // Don't redirect to app if user is logged in and accessing the password settings
  // If user is logged in and tries to access a public route, redirect to app
  if (isPublicRoute) {
    return navigateTo(aeAppUrl, { external: true })
  }
  // Redirect to main app for all other authenticated routes
  return navigateTo(aeAppUrl, { external: true })
})
