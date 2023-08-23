import type { H3Event } from 'h3'

export default async function isAdminUser(event: H3Event): Promise<boolean> {
  const { ADMIN_EMAILS } = useRuntimeConfig()
  console.log('ADMIN_EMAILS', ADMIN_EMAILS)
  const user = await supabaseServerUser(event)
  if (!user) return false
  console.log('user', user.email, !ADMIN_EMAILS.includes(user.email!))
  if (!ADMIN_EMAILS.includes(user.email!)) return false
  return true
}
