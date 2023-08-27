import type { User } from '@supabase/supabase-js'
import { useState } from '#imports'

export default function useSupabaseUser() {
  const supabase = useSupabaseClient()

  const user = useState<User | null>('supabase_user', () => null)

  // Asyncronous refresh session and ensure user is still logged in
  supabase?.auth.getSession().then(({ data: { session } }) => {
    if (!session) return (user.value = null)
    if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
      user.value = session.user
    }
  })

  return user
}
