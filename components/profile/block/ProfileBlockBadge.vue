<template>
  <div class="bg-[#f1f1f1] py-1 px-2 md:py-2 md:px-4 rounded-t-lg">
    <span class="text-black text-sm md:text-base flex gap-1 justify-center items-center">
      {{ util.strings.firstUpper(userRole.name || '') }}
      <Icon
        :name="util.users.roleIcon(userRole.id)"
        size="22px"
        class="text-blue-800 ml-1 md:ml-2"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { Role } from '@/types'

const util = useUtils()

defineProps({
  userRole: {
    type: Object as PropType<Role>,
    required: true
  }
})
</script>

<style scoped></style>
