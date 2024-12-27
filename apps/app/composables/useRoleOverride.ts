import { ref, watch } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'

export const useRoleOverride = () => {
  const roleOverride = ref<string | null>(null)
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isUpdating = ref(false)

  const updateRole = async (newRole: string | null) => {
    try {
      isUpdating.value = true
      const response = await $fetch('/api/dev/update-role', {
        method: 'POST',
        body: { role: newRole },
      })

      if (response.error) {
        console.error('Failed to update role:', response.error)
        throw response.error
      }

      // Force refresh the session to get new metadata
      const { data: session, error: refreshError } = await supabase.auth.refreshSession()

      if (refreshError) {
        console.error('Failed to refresh session:', refreshError)
        throw refreshError
      }

      console.log('Session refreshed:', session?.user?.app_metadata)

      if (newRole) {
        const originalRole = user.value?.app_metadata?.role
        console.log('Storing original role:', originalRole)
        if (!sessionStorage.getItem('originalRole')) {
          sessionStorage.setItem('originalRole', originalRole)
        }
      } else {
        sessionStorage.removeItem('originalRole')
      }

      return session
    } catch (error: any) {
      console.error('Role update failed:', error)
      throw error
    } finally {
      isUpdating.value = false
    }
  }

  watch(
    roleOverride,
    async (newRole) => {
      if (!user.value || isUpdating.value) return
      await updateRole(newRole)
    },
    { immediate: false },
  )

  return {
    roleOverride,
    setRoleOverride: (role: string | null) => {
      if (!isUpdating.value) {
        roleOverride.value = role
      }
    },
    getCurrentRole: () => user.value?.app_metadata?.role,
  }
}
