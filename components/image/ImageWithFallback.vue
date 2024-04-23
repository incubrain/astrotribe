<template>
  <div class="h-full w-full rounded-md overflow-hidden relative object-cover">
    <BaseImage
      :img="{
        src: image?.src || 'astron-era-hero.jpg',
        alt: image?.alt || 'this is a default fallback for when an image is not present',
        width: options?.width || 60,
        height: options?.height || 37,
        quality: options?.quality || 80
      }"
      class="h-full object-cover w-full"
    />
    <div
      v-if="!image?.src"
      class="absolute top-0 left-0 w-full h-full bg-black/20 dark:bg-black/40 z-50 flex justify-center items-center"
    >
      <h3 class="px-3 py-1 text-base rounded-lg foreground">NO IMAGE</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Image {
  src: string
  alt: string | null
  caption: string | null
  credit: string | null
}

interface Options {
  width: number
  height: number
  sizes: string | undefined | null
  quality: number | undefined | null
}

defineProps({
  image: {
    type: Object as () => Image | undefined,
    default: undefined
  },
  options: {
    type: Object as () => Options | undefined,
    default: () => ({
      width: 50,
      height: 50,
      sizes: null,
      quality: 80
    })
  }
})
</script>
