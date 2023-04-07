<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 items-center">
      <div class="w-[200px] h-[32px] relative bg-red-50 rounded-sm overflow-hidden flex items-center">
        <Icon name="uil:location-point" size="24px" />
        <p> {{ socials.instagram }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { Socials } from '~~/types/index.js'

defineProps({
  socials: {
    type: Object as PropType<Socials>,
    required: true
  }
})

</script>

<style scoped>

</style>
