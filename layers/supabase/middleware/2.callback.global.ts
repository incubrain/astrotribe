// middleware/2.callback.global.ts
import { defineNuxtRouteMiddleware } from '#app'

const callbackRoutes = ['/auth-callback']

export default defineNuxtRouteMiddleware((to, from) => {
  if (callbackRoutes.includes(to.path)) {
    to.meta.isCallback = true
  }
})
