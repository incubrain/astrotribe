<template>
  <div class="w-full aspect-auto h-[320px] md:h-[60vh] relative md:rounded-lg md:overflow-hidden">
    <BaseImage
      :img="{
        src: url,
        alt: 'AstroTribe feature'
      }"
      class="object-cover object-center w-full h-full overflow-hidden"
    />
    <div class="bg-[#12060625] w-full h-full bg-blend-overlay absolute top-0 left-0"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true
  }
})
</script>

<style scoped></style>
