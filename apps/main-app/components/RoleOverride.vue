<template>
  <div
    v-if="isDev"
    class="relative"
  >
    <div
      class="px-4 py-1 flex items-center justify-between z-[1000] transition-colors duration-200"
      :class="bannerColorClass"
    >
      <div class="flex text-sm items-center space-x-2">
        <span class="text-white">
          {{ currentRole ? `Viewing as ${currentRole}` : 'Using original role' }}
        </span>
        <span
          v-if="actualRole && actualRole !== currentRole"
          class="text-red-200 font-medium text-sm"
        >
          (Warning: Actual role is {{ actualRole }})
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <select
          v-model="currentRole"
          :disabled="isChangingRole"
          class="text-xs px-2 py-1 rounded bg-opacity-20 bg-white text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
          @change="handleRoleChange"
        >
          <option value="">Original Role</option>
          <option
            v-for="role in availableRoles"
            :key="role"
            :value="role"
          >
            {{ role }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isDev = computed(() => {
  const config = useRuntimeConfig()
  return config.public.nodeEnv === 'development'
})

const { setRoleOverride, getCurrentRole } = useRoleOverride()
const currentRole = ref('')
const actualRole = ref('')
const isChangingRole = ref(false)

const checkRole = () => {
  const role = getCurrentRole()
  // Only update if actually different to prevent unnecessary re-renders
  if (actualRole.value !== role) {
    actualRole.value = role
  }
}

onMounted(() => {
  checkRole()
  const interval = setInterval(checkRole, 2000)
  onUnmounted(() => clearInterval(interval)) // Clean up the interval
})

const availableRoles = ['super_admin', 'admin', 'user', 'guest']

const handleRoleChange = async () => {
  try {
    isChangingRole.value = true
    await setRoleOverride(currentRole.value || null)
    // Check a few times after change to ensure we catch the update
    const checks = [100, 500, 1000, 2000] // Check at different intervals
    checks.forEach((delay) => setTimeout(checkRole, delay))
  } catch (error) {
    console.error('Failed to change role:', error)
    // Maybe reset the select?
    currentRole.value = actualRole.value
  } finally {
    isChangingRole.value = false
  }
}

const bannerColorClass = computed(() => {
  switch (currentRole.value) {
    case 'super_admin':
      return 'bg-red-600'
    case 'admin':
      return 'bg-purple-600'
    case 'user':
      return 'bg-blue-600'
    case 'guest':
      return 'bg-gray-600'
    default:
      return 'bg-green-600'
  }
})
</script>
