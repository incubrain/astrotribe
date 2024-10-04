import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  const { aeLoginUrl, aeAuthUrl } = config.public
  const user = await useSupabaseUser()

  console.log('waiting for timeout', user.value)
  await new Promise((resolve) => setTimeout(resolve, 10000))

  if (!user.value) {
    console.log('USER_NOT_LOGGED_IN', aeAuthUrl, aeLoginUrl)
    return navigateTo(String(`${aeAuthUrl}${aeLoginUrl}`), { external: true })
  } else {
    console.log('USER_LOGGED_IN', user.value)
  }
})
