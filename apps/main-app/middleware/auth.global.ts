import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()
  const { aeLoginUrl, aeAuthUrl } = config.public
  const user = useSupabaseUser()
  const authToken = useCookie('auth_token')
  const authTokenFallback = useCookie('auth_token_fallback')

  if (!user.value && !authToken.value && !authTokenFallback.value) {
    console.log('USER_NOT_LOGGED_IN', aeAuthUrl, aeLoginUrl)
    return navigateTo(String(`${aeAuthUrl}${aeLoginUrl}`), { external: true })
  } else {
    console.log('USER_LOGGED_IN', user.value, authToken.value, authTokenFallback.value)
  }
})