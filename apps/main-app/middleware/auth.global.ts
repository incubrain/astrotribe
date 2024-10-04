import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  const { aeLoginUrl, aeAuthUrl } = config.public
  const session = useSupabaseSession()

  console.log('waiting for timeout', session.value)
  await new Promise((resolve) => setTimeout(resolve, 10000))

  if (!session.value) {
    console.log('USER_NOT_LOGGED_IN', aeAuthUrl, aeLoginUrl)
    return navigateTo(String(`${aeAuthUrl}${aeLoginUrl}`), { external: true })
  } else {
    console.log('USER_LOGGED_IN', session.value)
  }
})
