import { User } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'

export default async function supabaseServerUser(event: H3Event): Promise<User | null> {
  const client = await supabaseServerClient(event)

  const {
    data: { user: supabaseUser },
    error
  } = await client.auth.getUser()
  if (error) {
    throw createError({ statusMessage: error?.message })
  }

  event.context._user = error ? null : supabaseUser

  return event.context._user
}
