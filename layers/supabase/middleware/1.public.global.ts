// middleware/1.public.global.ts
import { defineNuxtRouteMiddleware } from '#app'

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/success']

export default defineNuxtRouteMiddleware((to, from) => {
  if (publicRoutes.includes(to.path)) {
    to.meta.isPublic = true
  }
})
