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
    <div class="flex gap-2 flex-col py-8 w-full justify-center items-center text-white">
      <div class="p-4 bg-white rounded-full border border-color">
        <NuxtLink to="/">
          <BaseImage
            :img="{
              src: 'astronera-logo.jpg',
              alt: 'AstronEra Logo',
              width: '60',
              height: '60'
            }"
          />
        </NuxtLink>
      </div>
      <h2 class="text-3xl font-extrabold">{{ title.main }}</h2>
      <span class="text-center font-bold">
        {{ title.subtitle }}
        <NuxtLink
          :to="helpUrl"
          class="text-primary-500 underline"
        >
          {{ title.label }}
        </NuxtLink>
      </span>
    </div>
    <PrimeCard>
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
