import type { H3Event } from 'h3'

export default async function isAdminUser(event: H3Event): Promise<boolean> {
  const { adminEmails } = useRuntimeConfig()
  const user = await supabaseServerUser(event)
  if (!user) return false
  if (!adminEmails.includes(user.email!)) return false
  return true
}
