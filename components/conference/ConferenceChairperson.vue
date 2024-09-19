<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <PrimeCard
      v-for="(host, i) in hosts"
      :key="`conference-host-${i}`"
      :pt="{
        root: 'flex flex-col md:flex-row w-full h-full overflow-hidden relative',
        body: ' background',
      }"
      :pt-options="{ mergeProps: true, mergeSections: true }"
    >
      <template #header>
        <div class="absolute left-0 top-0 z-10 hidden h-full w-full bg-black/10 dark:visible" />
        <IbImage
          :img="{
            src: `conference/speakers/${host.avatar}.jpg`,
            alt: `${host.given_name} is the chairperson at the Dark Sky Conservation India Conference`,
            width: '350',
            height: '350',
            loading: 'lazy',
            quality: '80',
            format: 'webp',
          }"
          class="aspect-square h-full w-full min-w-[180px] object-cover grayscale-[20%]"
        />
      </template>
      <template #content>
        <div class="flex flex-col justify-between gap-4">
          <div class="flex flex-col gap-4 text-sm">
            <h3 class="text-2xl font-semibold"> {{ host.given_name }} {{ host.surname }} </h3>
            <p class="flex items-center gap-2 font-semibold text-primary-500 dark:text-primary-600">
              <Icon
                name="mdi:account"
                class="flex-shrink-0"
                size="24px"
              />
              {{ host.professional_title }}
            </p>
            <p class="h-auto text-sm">
              {{ host.bio }}
            </p>
          </div>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

defineProps({
  hosts: {
    type: Object as PropType<SpeakerType[]>,
    required: true,
  },
})
</script>

<style scoped></style>
