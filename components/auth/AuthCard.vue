<script setup lang="ts">
import type { TitleType } from '@/types/content'

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    default: () => ({
      main: 'main title',
      subtitle: 'subtitle',
      label: 'label'
    })
  },
  helpUrl: {
    type: String,
    default: '/auth/login'
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4 flex-row py-8 w-full justify-center items-center text-white">
      <div class="p-4 bg-white rounded-full border border-color">
        <NuxtLink to="/">
          <BaseImage
            :img="{
              src: 'astronera-logo.jpg',
              alt: 'AstronEra Logo',
              width: '50',
              height: '50'
            }"
          />
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-3xl font-extrabold">{{ title.main }}</h2>
        <span class="text-center font-bold flex items-center">
          {{ title.subtitle }}
          <NuxtLink
            :to="helpUrl"
            class="text-primary-500 underline"
          >
          <PrimeButton link class="underline underline-offset-4">
            {{ title.label }}
          </PrimeButton>
          </NuxtLink>
        </span>
      </div>
    </div>
    <PrimeCard>
      <template #title>
        <div class="flex flex-col gap-4 xl:gap-6">
          <slot name="title" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4 xl:gap-6">
          <slot name="content" />
        </div>
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </PrimeCard>
  </div>
</template>

<style scoped></style>
