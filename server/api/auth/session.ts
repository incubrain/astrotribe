export default defineEventHandler(async (event) => {
  const { deleteSession } = getQuery(event)

  try {
    let session: any
    if (deleteSession === 'true') {
      console.log('Deleting user session', deleteSession)
      // remove session cookie
      await removeSession()
    } else {
      session = await validateAndUpdateSession()
    }

    if (!session) {
      console.log('No user user session found')
      return {
        error: null,
        status: 200,
        message: 'No user session found',
        data: null
      }
    }

    console.log('User session fetched from session', session)
    return {
      error: null,
      status: 200,
      message: 'User session fetched from session',
      data: session
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
