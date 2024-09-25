import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const loginUrl = useRuntimeConfig().public.loginUrl
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo(loginUrl, { external: true })
  }
})
