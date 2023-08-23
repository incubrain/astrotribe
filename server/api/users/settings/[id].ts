export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params
    const supabase = await supabaseServerClient(event)

    const { data: user, error } = await supabase
      .from('users')
      .select('*, roles(*)')
      .eq('auth_id', String(id))
      .single()

    let status: number
    let message: string
    let data: any

    if (user) {
      status = 200
      message = 'User fetched'
      data = handleBigInt(user)
    } else {
      status = 500
      message = `Error getting user: ${error.message}`
      data = undefined
    }
    return {
      status,
      message,
      user: data
    }
  } catch (error) {
    throw createError(`Error getting user: ${error}`)
  }
})
