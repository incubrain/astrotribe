import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/schema'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const supaUrl = config.public.SUPABASE_URL
  const supaKey = config.public.SUPABASE_KEY

  const publicClient = createClient<Database>(supaUrl, supaKey, {
    db: {
      schema: 'public'
    },
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true
    }
    // realtime: {
    //   channels,
    //   endpoint
    // },
    // global: {
    //   fetch: customFetch,
    //   headers: DEFAULT_HEADERS
    // }
  })

  nuxtApp.provide('publicClient', publicClient)
})
