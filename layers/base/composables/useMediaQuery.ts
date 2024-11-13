// composables/useMediaQuery.ts
export const useMediaQuery = (query: string) => {
  const matches = ref(false)

  if (import.meta.client) {
    const mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches

    const handler = (event: MediaQueryListEvent) => {
      matches.value = event.matches
    }

    // Watch for changes
    mediaQuery.addEventListener('change', handler)

    // Cleanup
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handler)
    })
  }

  return matches
}
