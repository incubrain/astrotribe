import type { H3Event } from 'h3'

export default async function isAdminUser(event: H3Event): Promise<boolean> {
  const { ADMIN_EMAILS } = useRuntimeConfig()
  const user = await supabaseServerUser(event)
  if (!user) return true
  if (!ADMIN_EMAILS.includes(user.email!)) return true
  return true
}
