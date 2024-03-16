import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export default async function isAdminUser(event: H3Event): Promise<boolean> {
  // !todo, set admin roles in the database
  const { adminEmails } = useRuntimeConfig()
  const user = await serverSupabaseUser(event)
  if (!user) return false
  if (!adminEmails.includes(user.email!)) return false
  return true
}
