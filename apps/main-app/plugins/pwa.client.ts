export default defineNuxtPlugin(() => {
  const notification = useNotification()
  const isOffline = ref(!navigator.onLine)
  const { $pwa } = useNuxtApp()

  if (import.meta.dev && import.meta.client) {
    console.log('Development mode: Cleaning up service workers...')

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister()
            console.log('Service worker unregistered:', registration.scope)
          })
        })
        .catch((error) => {
          console.error('Service worker cleanup failed:', error)
        })
    }
  }

  if (import.meta.client) {
    // Handle online/offline status
    window.addEventListener('online', () => {
      isOffline.value = false
      notification.success({
        summary: 'Connection Restored',
        message: 'Your internet connection has been restored',
      })
    })

    window.addEventListener('offline', () => {
      isOffline.value = true
      notification.warn({
        summary: 'Offline Mode',
        message: 'You are currently offline. Some features may be limited',
      })
    })

    // PWA functionality
    if ($pwa) {
      // Handle offline ready
      watch(
        () => $pwa.offlineReady.value,
        (ready) => {
          if (ready) {
            notification.success({
              summary: 'App Ready',
              message: 'Content has been cached for offline use',
            })
          }
        },
      )

      // Handle updates
      watch(
        () => $pwa.needRefresh.value,
        (needRefresh) => {
          if (needRefresh) {
            notification.info({
              summary: 'Update Available',
              message: 'Click here to update to the latest version',
            })
          }
        },
      )
    }
  }

  return {
    provide: {
      isOffline: readonly(isOffline),
    },
  }
})
