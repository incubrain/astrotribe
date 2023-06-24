<template>
  <div class="foreground py-1 px-2 md:py-2 md:px-4 rounded-t-lg">
    <span class="text-sm md:text-base flex gap-1 justify-center items-center">
      {{ util.strings.firstUpper(userRole.name || '') }}
      <UIcon
        :name="util.users.roleIcon(userRole.id)"
        class="ml-1 md:ml-2 w-6 h-6"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '@/types'

const util = useUtils()

defineProps({
  userRole: {
    type: Object as PropType<UserRole>,
    required: true
  }
})
</script>

<style scoped></style>
