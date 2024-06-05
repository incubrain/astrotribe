const protectedRoutes = ['/astrotribe', '/astrotribe/*']
const login = '/auth/login'

const isProtected = (navigatingTo: string): boolean => {
  return protectedRoutes?.some((path): boolean => {
    const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
    return regex.test(navigatingTo)
  })
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (!isProtected(to.path)) {
    // Public route
    return
  }

  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(login)
  }

  // handle Email Verification
  if (user.value.user_metadata?.provider === 'email') {
    if (!user.value.email_confirmed_at) {
      return navigateTo('/auth/success')
    }
  }
})
