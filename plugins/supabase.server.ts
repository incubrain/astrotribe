import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const accessToken = useCookie('sb-access-token').value
    const refreshToken = useCookie('sb-refresh-token').value

    const env = useRuntimeConfig().public
    if (!supabase) {
      supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
        db: {
          schema: 'public',
        },
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: false,
          persistSession: false,
          autoRefreshToken: false,
          debug: true,
        },
      })
    }

    // Set user & session server side
    if (accessToken && refreshToken) {
      const { data } = await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      })
      if (data?.user) {
        useSupabaseUser().value = data.user
      }
    }

    return {
      provide: {
        supabase,
      },
    }
  },
})
