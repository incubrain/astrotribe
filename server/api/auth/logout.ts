export default defineEventHandler(async (event) => {
  const { _supabaseClient } = event.context
  console.log('logout start')

  const { error } = await _supabaseClient.auth.signOut()
  if (error) {
    throw createError({
      statusCode: 401,
      message: error.message
    })
  }

  console.log('logout finish')
  return {
    status: 200,
    message: 'User logged out'
  }
})
