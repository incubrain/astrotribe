const login = '/auth/login'

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(login)
  }

  if (!!to.params.id && to.params.id !== user.value.id) {
    const newPath = to.fullPath.replace(to.params.id, user.value.id)
    return navigateTo(newPath)
  }
})
