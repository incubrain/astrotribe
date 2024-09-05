export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  router.beforeEach((to, from, next) => {
    if (to.path.includes('admin')) {
      to.meta.layout = 'admin'
    }
    else if (to.path.includes('auth')) {
      to.meta.layout = 'auth'
    }
    else if (to.path.includes('settings')) {
      to.meta.layout = 'app-settings'
    }
    else if (to.path.includes('astrotribe')) {
      to.meta.layout = 'app'
    }
    else {
      to.meta.layout = 'default'
    }
    next()
  })
})
