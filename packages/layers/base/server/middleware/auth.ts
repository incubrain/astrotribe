export default defineEventHandler((event) => {
  const authUrl = useRuntimeConfig().public.authUrl
  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    console.log('No auth token found, redirecting to auth URL')
    // return sendRedirect(event, authUrl)
  }

  // if (user.value.user_metadata?.provider === 'email') {
  //   if (!user.value.email_confirmed_at) {
  //     return navigateTo('/success')
  //   }
  // }
})
