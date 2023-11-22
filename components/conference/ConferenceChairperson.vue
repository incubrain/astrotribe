<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <UCard
      v-for="(host, i) in hosts"
      :key="`conference-host-${i}`"
      :ui="{
        base: 'flex flex-col md:flex-row h-full',
        background: 'bg-primary-50 dark:bg-primary-950',
        header: { padding: '', base: 'relative' },
        body: { base: 'flex flex-grow h-full', padding: 'sm:px-4' },
        footer: { base: 'flex flex-shrink', padding: 'sm:px-4' },
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
      }"
      class="h-full"
    >
      <template #header>
        <div class="invisible dark:visible absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
        <NuxtImg
          :src="`conference/speakers/${host.avatar}.jpg`"
          :alt="`${host.given_name} is the chairperson at the Dark Sky Conservation India Conference`"
          width="350"
          height="350"
          loading="lazy"
          quality="80"
          format="webp"
          class="object-cover aspect-square h-full grayscale-[20%] min-w-[180px]"
        />
      </template>
      <div class="flex flex-col gap-4 justify-between">
        <div class="text-sm flex flex-col gap-4">
          <h3 class="text-2xl font-semibold"> {{ host.given_name }} {{ host.surname }} </h3>
          <p class="flex gap-2 items-center text-primary-500 dark:text-primary-600 font-semibold">
            <UIcon
              name="i-mdi-account"
              class="w-4 h-4 flex-shrink-0"
            />
            {{ host.professional_title }}
          </p>
          <p class="h-auto text-sm">
            {{ host.bio }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

defineProps({
  hosts: {
    type: Object as PropType<SpeakerType[]>,
    required: true
  }
})
</script>

<style scoped></style>
