<template>
  <div class="relative flex items-center justify-center">
    <NuxtImg
      :class="`w-full object-${fit} ${objectPosition} h-[540px]`"
      :src="img.src"
      :alt="img.alt"
    />
    <div
      class="absolute z-10 flex flex-col lg:flex-row text-white gap-8 lg:gap-16 px-4 xl:px-8 justify-center items-center"
    >
      <slot />
      <div class="space-y-4 block">
        <h2 class="text-3xl font-bold lg:text-5xl bg-black/30 py-1 px-2 rounded-sm">
          {{ title }}
        </h2>
        <h4
          v-if="subtitle"
          class="text-xl w-auto inline-block font-semibold lg:text-3xl bg-black/30 py-1 px-2 rounded-sm"
        >
          {{ subtitle }}
        </h4>
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full bg-black/25" />
  </div>
</template>

<script setup lang="ts">
interface ImageProps {
  src: string
  alt: string
}

defineProps({
  img: {
    type: Object as PropType<ImageProps>,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  fit: {
    type: String,
    default: 'cover'
  },
  objectPosition: {
    type: String,
    default: 'object-bottom'
  }
})
</script>

<style scoped></style>
