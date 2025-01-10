// middleware/auth-redirect.global.client.ts
import { useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client
  if (!import.meta.client) return

  // Check if user is logged in
  const user = useSupabaseUser()
  if (!user.value) return

  // Check if user has chosen "Stay Here" before
  console.log('Checking StayHere Cookie')
  const stayHere = useCookie<boolean>('stayHere', { default: () => false })
  if (stayHere.value) return

  console.log('Redirecting to home in 5 seconds')
  useAuthRedirectStore().showRedirectModal = true
})
