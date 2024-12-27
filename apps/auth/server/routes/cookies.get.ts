export default defineEventHandler((event) => {
  const cookies = getHeaders(event)
  console.log('All Headers:', cookies)

  // Or specifically cookies
  const allCookies = parseCookies(event)
  console.log('Parsed Cookies:', allCookies)

  return { cookies: allCookies }
})
