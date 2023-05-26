<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 items-center">
      <div
        class="w-[200px] h-[32px] relative bg-red-50 rounded-sm overflow-hidden flex items-center"
      >
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
import type { Socials } from '@/types'

defineProps({
  socials: {
    type: Object as PropType<Socials>,
    required: true
  }
})
</script>

<style scoped></style>
