// plugins/role-override.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Initialize role override system
  if (import.meta.dev) {
    const { roleOverride } = useRoleOverride()

    // You could add development-only watches or logging here
    watch(roleOverride, (newRole) => {
      console.log(`[DEV] Role override changed to: ${newRole || 'original role'}`)
    })
  }
})
