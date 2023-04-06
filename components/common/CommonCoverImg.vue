<template>
  <div class="w-full aspect-auto h-[200px] md:h-[80vh] relative md:rounded-lg md:overflow-hidden">
    <div
      class="flex items-center justify-center h-full w-full md:mb-12 bg-center bg-contain md:bg-cover"
      :style="{ backgroundImage: `url(${url})` }"
    ></div>
    <div class="bg-[#12060625] w-full h-full bg-blend-overlay absolute top-0 left-0"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  url: string
}

withDefaults(defineProps<Props>(), {
  url: '/cover1.jpg'
})

</script>

<style scoped></style>
