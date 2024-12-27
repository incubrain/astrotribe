import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app'
import { useRuntimeConfig, useSupabaseClient } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  // const { $formbricks } = useNuxtApp()

  const { loginURL, authURL } = config.public
  const supabase = useSupabaseClient()

  // List of public routes that don't require authentication
  const publicRoutes = ['/auth-callback']

  if (publicRoutes.includes(to.path)) {
    return // Allow access to public routes without checking auth
  }

  const { data, error } = await supabase.auth.getSession()

  if (data.session) {
    // try {
    //   $formbricks.setUserId(data.session.user.id)
    // } catch (err) {
    //   console.warn('Failed to set Formbricks user ID:', err)
    // }
  } else if (!data.session) {
    console.log('USER_NOT_LOGGED_IN', `${authURL}${loginURL}`)
    return navigateTo(String(`${authURL}${loginURL}`), { external: true })
  }
})
