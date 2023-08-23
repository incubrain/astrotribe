import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'
import { COOKIE_OPTIONS, COOKIE_KEYS, EVENTS } from '@/types/supabase'

let supabase: SupabaseClient

const setCookieValue = (key: string, value: string | null) => {
  useCookie(key, COOKIE_OPTIONS).value = value
}

const setCookiesNull = () => {
  Object.values(COOKIE_KEYS).forEach((key) => setCookieValue(key, null))
}

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre', // Enforce the plugin to run before other plugins.
  async setup() {
    const env = useRuntimeConfig().public
    const router = useRouter()

    if (!supabase) {
      // Initialize Supabase client if it's not already done.
      supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
        db: { schema: 'public' },
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          debug: true,
        },
      })
    }

    const user = useSupabaseUser()

    supabase.auth.onAuthStateChange(async (event, session) => {
      // Update the user value if the session's user differs from the current one.
      console.log('onAuthStateChange', event, session)
      if (!session) {
        user.value = null
      } else if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
        user.value = session.user
      }

      if (event === EVENTS.SIGNED_OUT) {
        // If the user signed out, clear cookies.
        setCookiesNull()
        user.value = null
        router.push('/auth/login')
      }

      // Only proceed if the event is 'SIGNED_IN' or 'TOKEN_REFRESHED', and a session exists.
      if (![EVENTS.SIGNED_IN, EVENTS.TOKEN_REFRESHED].includes(event) || !session) return
      setCookieValue(COOKIE_KEYS.accessToken, session.access_token)
      setCookieValue(COOKIE_KEYS.refreshToken, session.refresh_token)

      // Update provider tokens if they exist.
      if (!session.provider_token && !session.provider_refresh_token) return
      setCookieValue(COOKIE_KEYS.providerToken, session.provider_token!)
      setCookieValue(COOKIE_KEYS.providerRefreshToken, session.provider_refresh_token!)
    })

    return { provide: { supabase } }
  },
})
