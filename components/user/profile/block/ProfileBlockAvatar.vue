<template>
  <div
    class="absolute left-0 overflow-hidden w-auto h-auto border-8 border-color rounded-full foreground ml-4 md:ml-0 top-[-40px] md:top-[-90px]"
  >
    <NuxtImg
      class="hidden md:flex"
      :src="avatar"
      width="180"
      height="180"
    />
    <NuxtImg
      class="md:hidden"
      :src="avatar"
      width="80"
      height="80"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  avatar: string
}>()
</script>

<style scoped></style>
