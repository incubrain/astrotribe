export default defineEventHandler(async (event) => {
  if (event.path.includes('admin')) {
    console.log('admin path', event.path)
    const isAdmin = await isAdminUser(event)
    console.log('admin path', isAdmin)
    if (!isAdmin) {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
  }
})
