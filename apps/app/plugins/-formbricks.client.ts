// plugins/formbricks.client.ts
import type {} from '@formbricks/js'

declare global {
  interface Window {
    formbricks: FormbricksAPI
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const { formbricksHost, formbricksEnvironment } = useRuntimeConfig().public

  if (import.meta.client) {
    // Add Formbricks script tag
    const script = document.createElement('script')
    script.src = 'https://cdn.formbricks.com/formbricks.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Initialize once script loads
    script.onload = () => {
      window.formbricks?.init({
        environmentId: for
        mbricksEnvironment,
        apiHost: formbricksHost,
      })
      console.log('Formbricks initialized')
    }
  }

  // Register route change handler
  nuxtApp.hook('page:finish', () => {
    if (import.meta.client && window.formbricks) {
      window.formbricks.registerRouteChange()
    }
  })

  // Provide formbricks to the app
  return {
    provide: {
      formbricks: import.meta.client ? window.formbricks : undefined,
    },
  }
})
