import { serverSupabaseSession, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  console.log(await serverSupabaseSession(event), 'SESSION')
  console.log(await serverSupabaseUser(event), 'USER')
})
