import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { role } = await readBody(event)
  const user = await serverSupabaseUser(event)
  const supabaseAdmin = serverSupabaseServiceRole(event)
  const env = useRuntimeConfig().public

  //   check if we are in development mode
  if (env.nodeEnv !== 'development') {
    console.warn(`user trying to override role from ${user.role} to ${role} in ${env.nodeEnv}`)
    return { error: 'Role override is only allowed in development mode' }
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    app_metadata: { role },
})

  if (error) throw error
  return data
})
