// middleware/reset-password.ts
export default defineNuxtRouteMiddleware((to) => {
  // Only allow access to reset-password page with valid hash
  if (to.path === '/reset-password' && !to.hash) {
    return navigateTo('/login')
  }
})
