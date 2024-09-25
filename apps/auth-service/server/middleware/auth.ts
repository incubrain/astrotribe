import { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  // This is just an example. In reality, you'd set this cookie after successful authentication.
  setCookie(event, 'auth_token', 'your_auth_token_here', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    domain: '.yourdomain.com', // Allow cookie to be read by all subdomains
  })
})
