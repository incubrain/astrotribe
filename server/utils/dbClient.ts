import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { Database } from '~/supabase/database.types'
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'

export async function dbClient(event: H3Event): Promise<SupabaseClient> {
  return await serverSupabaseClient<Database>(event)
}

export function dbClientAdmin(event: H3Event): SupabaseClient {
  return serverSupabaseServiceRole<Database>(event)
}
