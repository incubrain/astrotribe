import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useRuntimeConfig, useSupabaseClient } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const { aeLoginUrl, aeAuthUrl } = config.public
  const supabase = useSupabaseClient()

  // List of public routes that don't require authentication
  const publicRoutes = ['/auth-callback']

  if (publicRoutes.includes(to.path)) {
    return // Allow access to public routes without checking auth
  }

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    console.log('USER_NOT_LOGGED_IN', `${aeAuthUrl}${aeLoginUrl}`)
    return navigateTo(String(`${aeAuthUrl}${aeLoginUrl}`), { external: true })
  } else {
    console.log('USER_LOGGED_IN', data.session)
  }
})
