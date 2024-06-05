const login = '/auth/login'
const notAdminRedirect = '/astrotribe'

const isAdmin = (role: string) => role === 'admin' || role === 'super_admin'

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(login)
  }

  if (!isAdmin(user.value.app_metadata.role)) {
    return navigateTo(notAdminRedirect)
  }
})
