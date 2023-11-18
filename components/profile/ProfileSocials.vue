<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <div class="w-[200px] h-[32px] relative rounded-sm overflow-hidden flex items-center">
        <UIcon
          name="i-material-symbols-location-on"
          class="w-[20px] h-[20px]"
        />
        <p> {{ socials.platform }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserSocialType } from '@/types/users'

defineProps({
  socials: {
    type: Object as PropType<UserSocialType>,
    required: true
  }
})
</script>

<style scoped></style>
