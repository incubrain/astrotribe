const protectedRoutes = ['/astrotribe', '/astrotribe/*']
const login = '/auth/login'

// const isProtected = (to: string): boolean => {
//   return protectedRoutes?.some((path): boolean => {
//     const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
//     return !regex.test(to)
//   })
// }

export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSupabaseSession()
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // const session = await $fetch('/api/auth/session', {
  //   method: 'GET',
  //   headers: useRequestHeaders(['cookie'])
  // })

  console.log('session', session.value)
  console.log('user', user.value)
  console.log('client', client)
  //   if (isProtected(to.path)) return
  //   const user = useSupabaseUser()
  //   if (!user.value) {
  //     return navigateTo(login)
  //   }
})
