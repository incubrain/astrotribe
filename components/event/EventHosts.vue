<template>
  <div class="relative flex flex-wrap items-center p-4">
    <section
      v-for="(host, idx) in hosts"
      :key="host.id"
      class="text-black"
    >
      <div
        :class="
          idx > 0
            ? 'w-10 h-10 overflow-hidden rounded-full border-4 border-white ml-[-20px]'
            : 'w-10 h-10 overflow-hidden rounded-full border-4 border-white relative z-10'
        "
      >
        <img
          class="w-full"
          :src="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/${host.id}/avatar/${host.avatar}`"
        />
      </div>
    </section>
    <section class="pl-2">
      <h3 class="m-0 text-lg text-[#162b39] font-bold">
        <span
          v-for="(host, index) in hosts"
          :key="host.id"
        >
          <NuxtLink :to="`/profile/${host.id}`">
            <span> {{ host.given_name }} </span>
            <span v-if="index !== hosts.length - 1">, </span>
          </NuxtLink>
        </span>
        <em class="pl-2 text-[#8492a6]">hosting</em>
      </h3>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { EventHost } from '@/types'

defineProps({
  hosts: {
    type: Array as PropType<EventHost[]>,
    required: true
  }
})
</script>

<style scoped>

</style>
