export default defineEventHandler(async () => {
  try {
    const permissions = await getUserPermissions()

    if (!permissions) {
      console.log('No user permissions found')
      return {
        status: 404,
        message: 'No user permissions found',
        data: null
      }
    }

    return {
      status: 200,
      message: 'User permissions fetched from session',
      data: permissions
    }
  } catch (error: any) {
    console.error('permissions error', error.message)
    return {
      status: 500,
      message: error.message,
      data: null
    }
  }
})
