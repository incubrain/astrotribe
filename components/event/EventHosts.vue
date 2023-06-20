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
        <NuxtImg
          :src="
            s.image.optimized({
              bucket: 'profile-public',
              folderPath: `${host.id}/avatar`,
              file: host.avatar,
              isPrivate: false,
              transform: { width: 50, height: 50, fit: 'cover', quality: 75 }
            })
          "
          loading="lazy"
          :alt="`${host.given_name} is an AstroTribe event host`"
          class="aspect-square object-contain w-full"
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

const s = useStorage()

defineProps({
  hosts: {
    type: Array as PropType<EventHost[]>,
    required: true
  }
})
</script>

<style scoped></style>
