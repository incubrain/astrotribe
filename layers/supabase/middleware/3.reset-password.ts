// middleware/3.callback.global.ts
import { defineNuxtRouteMiddleware } from '#app'

const isResetPasswordPath = ['/settings/password']

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === isResetPasswordPath && !to.hash) {
    return navigateTo('/login')
  } else if (to.path === isResetPasswordPath) {
    to.meta.isResetPassword = true
  }
})
