<template>
  <div class="relative flex flex-wrap items-center p-4">
    <section
      v-for="(host, idx) in hosts"
      :key="host.id"
    >
      <div
        :class="
          idx > 0
            ? 'w-8 h-8 overflow-hidden rounded-full border-2 ml-[-20px] border-inverted'
            : 'w-8 h-8 overflow-hidden rounded-full border-2 relative z-10 border-inverted'
        "
      >
        <img
          class="w-full"
          :src="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/profile-public/${host.id}/avatar/${host.avatar}`"
        />
      </div>
    </section>
    <section class="pl-2">
      <h3 class="m-0 text-base font-semibold">
        <span
          v-for="(host, index) in hosts"
          :key="host.id"
        >
          <NuxtLink :to="`/profile/${host.id}`">
            <span> {{ host.given_name }} </span>
            <span v-if="index !== hosts.length - 1">, </span>
          </NuxtLink>
        </span>
        <span class="pl-2 text-xs">hosting</span>
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

<style scoped></style>
