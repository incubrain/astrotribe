import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export default function supabaseServerServiceRole<T>(event: H3Event): SupabaseClient<T> {
  const {
    supabaseServiceKey,
    public: { supabaseUrl }
  } = useRuntimeConfig()

  // Make sure service key is set
  if (!supabaseServiceKey) {
    throw new Error('Missing `supabaseServiceKey` in `.env`')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseServiceRole) {
    const auth = {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, { auth })

    event.context._supabaseServiceRole = supabaseClient
  }

  if (!event.context._supabaseServiceRole)
    throw createError({ statusMessage: 'Supabase client not found' })
  return event.context._supabaseServiceRole as SupabaseClient<T>
}
