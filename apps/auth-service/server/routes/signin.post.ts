export default defineEventHandler(async (event) => {

  if (authenticated) {
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      domain: '.domain.com',
    })
  }

})
