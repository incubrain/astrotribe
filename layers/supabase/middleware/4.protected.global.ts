import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip if flagged as public or callback or reset password
  if (to.meta.isPublic || to.meta.isCallback || to.meta.isResetPassword) {
    return
  }

  const config = useRuntimeConfig()
  const { loginURL, authURL } = config.public
  console.log('USER_NOT_LOGGED_IN', authURL, loginURL)

  try {
    const user = useSupabaseUser()
    if (!user.value) {
      return navigateTo(String(`${authURL}${loginURL}`), { external: true })
    }
  } catch (error: any) {
    console.error('middleware error', `${authURL}${loginURL}`)
    // return navigateTo(String(`${authURL}${loginURL}`), { external: true })
  }
})
