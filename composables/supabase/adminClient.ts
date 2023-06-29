import { createClient } from '@supabase/supabase-js'

export default () => {
  const cfg = useRuntimeConfig()
  const serviceKey = cfg.SUPABASE_SERVICE_KEY
  const url = cfg.public.SUPABASE_URL
  return createClient(url, serviceKey, {
    db: {
      schema: 'public'
    },
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true
    }
  })
}
