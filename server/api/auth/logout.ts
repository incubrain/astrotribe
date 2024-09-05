export default defineEventHandler(async (event) => {
  try {
    await removeSession()
    return {
      error: null,
      status: 200,
      message: 'User session removed',
      data: null,
    }
  }
  catch (error: any) {
    console.error('session error', error.message)
    return {
      error,
      status: 500,
      message: error.message,
      data: null,
    }
  }
})
