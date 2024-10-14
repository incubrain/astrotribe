import formbricks from '@formbricks/js'

export default defineNuxtPlugin((nuxtApp) => {
  const { formbricksHost, formbricksEnvironment } = nuxtApp.$config.public

  if (typeof window !== 'undefined') {
    formbricks.init({
      environmentId: formbricksEnvironment,
      apiHost: formbricksHost,
    })
  }

  console.log('Formbricks initialized', formbricks)
  // Make formbricks available throughout the app
  nuxtApp.provide('formbricks', formbricks)

  // Register route change handler
  nuxtApp.hook('page:finish', () => {
    if (typeof formbricks !== 'undefined') {
      formbricks.registerRouteChange()
    }
  })
})
