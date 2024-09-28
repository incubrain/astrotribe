import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (user) {
    // User is authenticated
    const session = await client.auth.getSession()
    if (session.data.session) {
      // Set a session identifier in the cookie instead of the actual token
      const sessionId = session.data.session.access_token
      setCookie(event, 'session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.up.railway.app' : '.localhost',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
    }
  }
})
