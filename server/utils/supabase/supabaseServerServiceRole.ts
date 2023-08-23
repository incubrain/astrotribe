import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export default function serverSupabaseServiceRole<T>(event: H3Event): SupabaseClient<T> {
  const {
    SUPABASE_SERVICE_KEY,
    public: { SUPABASE_URL }
  } = useRuntimeConfig()

  // Make sure service key is set
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('Missing `SUPABASE_SERVICE_KEY` in `.env`')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseServiceRole) {
    const auth = {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth })

    event.context._supabaseServiceRole = supabaseClient
  }

  if (!event.context._supabaseServiceRole)
    throw createError({ statusMessage: 'Supabase client not found' })
  return event.context._supabaseServiceRole as SupabaseClient<T>
}
