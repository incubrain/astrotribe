<template>
  <div
    v-if="userRole?.id"
    class="px-2 py-1 rounded-t-lg foreground md:py-2 md:px-4"
  >
    <span class="flex items-center justify-center gap-1 text-sm md:text-base">
      {{ util.strings.firstUpper(userRole.name || '') }}
      <Icon
        :name="userRole.icon"
        class="w-6 h-6 ml-1 md:ml-2"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { UserRoleType } from '@/types/users'

const util = useUtils()

defineProps({
  userRole: {
    type: Object as PropType<UserRoleType>,
    required: true
  }
})
</script>

<style scoped></style>
