import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useRuntimeConfig, useSupabaseClient } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const { aeAppUrl } = config.public
  const supabase = useSupabaseClient()

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    console.log('USER_NOT_LOGGED_IN')
  } else {
    console.log('USER_LOGGED_IN', data.session)
    navigateTo(aeAppUrl, { external: true })
  }
})
