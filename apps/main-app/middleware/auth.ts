import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()
  const { aeLoginUrl, aeAuthUrl } = config.public
  const user = useSupabaseUser()

  if (!user.value) {
    console.log('USER_NOT_LOGGED_IN', aeAuthUrl, aeLoginUrl)
    return navigateTo(String(`${aeAuthUrl}${aeLoginUrl}`), { external: true })
  } else {
    console.log('USER_LOGGED_IN', user.value)
  }
})
