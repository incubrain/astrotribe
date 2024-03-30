const protectedRoutes = ['/astrotribe', '/astrotribe/*']
const login = '/auth/login'

const isProtected = (to: string): boolean => {
  return protectedRoutes?.some((path): boolean => {
    const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
    return !regex.test(to)
  })
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (isProtected(to.path)) return

  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(login)
  }
})
