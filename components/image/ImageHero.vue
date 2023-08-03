<template>
  <div class="relative flex items-center justify-center">
    <NuxtImg
      :class="`w-full object-cover ${objectPosition} h-[540px]`"
      :src="img.src"
      :alt="img.alt"
    />
    <div class="absolute z-10 flex flex-col text-white space-y-2 justify-start items-start">
      <h2 class="text-3xl font-bold lg:text-5xl bg-white/30 py-1 px-2 rounded-sm">
        {{ title }}
      </h2>
      <slot />
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
  objectPosition: {
    type: String,
    default: 'object-bottom'
  }
})
</script>

<style scoped></style>
