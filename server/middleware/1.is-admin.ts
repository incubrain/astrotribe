export default defineEventHandler(async (event) => {
  if (event.path.includes('adminTest')) {
    const isAdmin = await isAdminUser(event)
    if (!isAdmin) {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
  }
})

// !logic:critical:med:2 - add all insert and some update as admin only, 
// !logic:critical:med:2 - create is-current-user middleware for profile update etc.
