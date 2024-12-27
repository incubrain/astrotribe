// middleware/reset-password.ts
export default defineNuxtRouteMiddleware((to) => {
  // Only allow access to settings/password page with valid hash
  if (to.path === '/settings/password' && !to.hash) {
    return navigateTo('/login')
  }
})
