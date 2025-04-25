import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip if flagged as public or callback or reset password
  if (to.meta.isPublic || to.meta.isCallback || to.meta.isResetPassword) {
    return
  }

  const config = useRuntimeConfig()
  const { loginPath, authURL } = config.public
  console.log('USER_NOT_LOGGED_IN', authURL, loginPath)

  try {
    const user = useSupabaseUser()
    console.debug('Protected route access', {
      path: to.path,
      isAuthenticated: !!user.value,
    })

    if (!user.value) {
      // Preserve the original URL the user was trying to access
      let targetUrl = to.fullPath
      if (to.fullPath !== '/') {
        // Encode the target URL to be used as a redirect parameter
        targetUrl = encodeURIComponent(to.fullPath)
      }

      // Redirect to login with the redirect parameter
      return navigateTo(String(`${authURL}${loginPath}?redirect_to=${targetUrl}`), {
        external: true,
      })
    }
  } catch (error: any) {
    console.error('Protected middleware error', { error, path: to.path })
    // Fallback to login if there's an error
    return navigateTo(String(`${authURL}${loginPath}`), { external: true })
  }
})
