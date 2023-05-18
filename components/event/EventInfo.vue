<template>
  <article>
    <section class="relative p-4">
      <div class="flex flex-col justify-center items-center bg-white rounded-md shadow-md p-4 absolute left-4 top-[-10rem]">
        <span class="block text-lg text-[#162b39] font-light mb-2">{{ time.month }}</span>
        <span class="block text-base text-[#d73601] font-bold text-center">{{ time.day }}</span>
      </div>
      <h2 class="m-0 text-lg text-[#162b39] font-bold">{{ event.title }}</h2>
      <span class="text-sm text-black font-thin"> {{ event.body }}</span>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventBasic } from '@/types'

defineProps({
  event: {
    type: Object as PropType<EventBasic>,
    required: true
  },
  time: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style scoped>
/* EventInfo related styles */
</style>
