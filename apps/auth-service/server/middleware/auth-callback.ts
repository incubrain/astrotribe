import { setCookie, defineEventHandler } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { aeAppUrl } = useRuntimeConfig().public
  try {
    const client = await serverSupabaseClient(event)
    const {
      data: { user },
      error,
    } = await client.auth.getUser()
    if (error) throw error
    if (user) {
      // User is authenticated
      // Set a session cookie or perform additional logic
      setCookie(event, 'my_auth_cookie', 'some_value', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : 'localhost',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
    }
    // Redirect to the home page or intended route
    console.info('Authentication Callback Success', event)
    return sendRedirect(event, aeAppUrl)
  } catch (error) {
    console.error('Authentication Callback Error:', error)
  }
})
