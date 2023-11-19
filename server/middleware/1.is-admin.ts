export default defineEventHandler(async (event) => {
  if (event.path.includes('admin')) {
    const isAdmin = await isAdminUser(event)
    if (!isAdmin) {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
  }
})
