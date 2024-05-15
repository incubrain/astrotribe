export default defineEventHandler(async (event) => {
  try {
    const session = await validateAndUpdateSession()

    if (!session) {
      console.log('No user user session found')
      return {
        error: null,
        status: 200,
        message: 'No user session found',
        data: null
      }
    }

    return {
      error: null,
      status: 200,
      message: 'User session fetched from session',
      data: session.user
    }
  } catch (error: any) {
    console.error('session error', error.message)
    return {
      error,
      status: 500,
      message: error.message,
      data: null
    }
  }
})
