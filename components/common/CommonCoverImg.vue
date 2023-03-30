<template>
  <div class="absolute top-0 left-0 right-0 w-full h-[80vh]">
    <div
      class="flex items-center justify-center h-full mb-12 bg-fixed bg-center bg-cover"
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
