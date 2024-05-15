<template>
  <div
    class="absolute left-0 overflow-hidden w-auto h-auto border-8 border-color rounded-full foreground ml-4 md:ml-0 top-[-40px] md:top-[-90px]"
  >
    <BaseImage
      :img="{
        src: avatar,
        width: '180',
        height: '180'
      }"
      class="hidden md:flex"
    />
    <BaseImage
      :img="{
        src: avatar,
        width: '80',
        height: '80'
      }"
      class="md:hidden"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
}>()
</script>

<style scoped></style>
