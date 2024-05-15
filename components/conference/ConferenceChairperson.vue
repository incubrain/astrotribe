<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <PrimeCard
      v-for="(host, i) in hosts"
      :key="`conference-host-${i}`"
      :pt="{
        root: 'flex flex-col md:flex-row w-full h-full overflow-hidden relative'
      }"
    >
      <template #header>
        <div class="hidden dark:visible absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
        <BaseImage
          :img="{
            src: `conference/speakers/${host.avatar}.jpg`,
            alt: `${host.given_name} is the chairperson at the Dark Sky Conservation India Conference`,
            width: '350',
            height: '350',
            loading: 'lazy',
            quality: '80',
            format: 'webp'
          }"
          class="object-cover aspect-square h-full grayscale-[20%] min-w-[180px] w-full"
        />
      </template>
      <template #content>
        <div class="flex flex-col gap-4 justify-between">
          <div class="text-sm flex flex-col gap-4">
            <h3 class="text-2xl font-semibold"> {{ host.given_name }} {{ host.surname }} </h3>
            <p class="flex gap-2 items-center text-primary-500 dark:text-primary-600 font-semibold">
              <Icon
                name="mdi:account"
                class="w-4 h-4 flex-shrink-0"
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
    required: true
  }
})
</script>

<style scoped></style>
