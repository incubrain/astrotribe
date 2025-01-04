// middleware/debug.global.ts
export default defineNuxtRouteMiddleware((to) => {
  console.log('🔍 [Debug] Route middleware executing:', {
    path: to.path,
    fullPath: to.fullPath,
    name: to.name,
    params: to.params,
    query: to.query,
    hash: to.hash,
  })
})
