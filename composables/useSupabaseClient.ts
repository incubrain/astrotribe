import { SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseClient = <T>() => {
  return useNuxtApp()?.$supabase as SupabaseClient<T>
}
