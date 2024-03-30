export default defineEventHandler(async (event) => {
  const supabase = await dbClient(event)

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw createError({ message: error.message })
    }

    // Return success response
    return {
      statusCode: 200,
      message: 'Logout successful'
    }
  } catch (error) {
    // Handle error
    console.error('Logout failed:', error)

    // Return error response
    return {
      statusCode: 500,
      message: 'Logout failed'
    }
  }
})
