export default defineEventHandler(async (event) => {
  const { forceRefresh } = getQuery(event)

  try {
    const session = await getUserSession(Boolean(forceRefresh))

    if (!session) {
      console.log('No user session found')
      return {
        status: 404,
        message: 'No user session found',
        data: null
      }
    }

    return {
      status: 200,
      message: 'User session fetched from session',
      data: session
    }
  } catch (error: any) {
    console.error('session error', error.message)
    return {
      status: 500,
      message: error.message,
      data: null
    }
  }
})
