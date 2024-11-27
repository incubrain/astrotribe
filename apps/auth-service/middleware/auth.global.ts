// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const { aeAppUrl } = config.public
  const supabase = useSupabaseClient()

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/success', // For registration success page
  ]

  // Allow access to public routes without checking auth
  if (publicRoutes.includes(to.path)) {
    return
  }

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    console.log('USER_NOT_LOGGED_IN')
    return navigateTo('/login')
  }

  // Don't redirect to app if user is logged in and accessing the password settings
  if (to.path === '/settings/password') {
    return
  }

  // Redirect to main app for all other authenticated routes
  console.log('USER_LOGGED_IN', data.session)
  return navigateTo(aeAppUrl, { external: true })
})
