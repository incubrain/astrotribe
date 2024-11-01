export const usePWA = () => {
  const nuxtApp = useNuxtApp()
  const { $pwaState, $pwaActions } = nuxtApp

  if (!$pwaState || !$pwaActions) {
    throw new Error('PWA plugin not installed')
  }

  return {
    // States
    isInstallable: $pwaState.isInstallable,
    isUpdateAvailable: $pwaState.isUpdateAvailable,
    isOfflineReady: $pwaState.isOfflineReady,
    isPWAInstalled: $pwaState.isPWAInstalled,
    hasError: $pwaState.hasError,
    isActivated: $pwaState.isActivated,

    // Actions
    install: $pwaActions.install,
    update: $pwaActions.update,
    cancelInstall: $pwaActions.cancelInstall,
    cancelUpdate: $pwaActions.cancelUpdate,
  }
}
