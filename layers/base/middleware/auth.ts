import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()
  const loginUrl = config.public.loginUrl
  const user = useSupabaseUser()
  const authToken = useCookie('auth_token')
  const authTokenFallback = useCookie('auth_token_fallback')

  if (!user.value && !authToken.value && !authTokenFallback.value) {
    console.log('User not logged in')
    return navigateTo(loginUrl, { external: true })
  }
})
