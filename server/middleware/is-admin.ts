import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const log = useServerLogger('is-admin-middleware')
  if (event.path.includes('api/admin')) {
    const user = await serverSupabaseUser(event)

    // Check if the user has the required role
    const role = user?.app_metadata?.role

    if (role !== 'admin' && role !== 'super_admin') {
      log.warn(`Unauthorized Access Attempt to ${event.path} by ${user?.id}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized Access',
        message: 'You do not have permission to access this resource'
      })
    }
  }
})
