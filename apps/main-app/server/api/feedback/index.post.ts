import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const currentUser = await serverSupabaseUser(event)

  try {
    const body = await readBody(event)

    await supabase.from('feedbacks').insert({
      user_id: currentUser.id,
      ...body,
    })
  } catch (error) {
    return { message: error.message }
  }

  return { status: 200, message: 'Successfully submitted feedback' }
})
