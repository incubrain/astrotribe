<script setup lang="ts">
// !todo:consider:2 - add a delay to function execution, fade out the auth cards so the bg image is fully visible for a few seconds, then execute
// !todo:low:1 - add transitions to the auth cards
// !todo:high:1 - add subtitle prompt to all auth cards
// !todo:med:2 - handle session expired, redirect to login with explanation
</script>

<template>
  <div class="relative flex h-full min-h-screen w-full items-center justify-start">
    <div class="foreground relative z-20 min-h-lvh w-full min-w-[340px] max-w-[480px] p-4">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </div>
    <div class="absolute left-0 top-0 flex h-full w-full">
      <div class="absolute left-0 top-0 h-full w-full bg-black/40" />
      <AppBackground class="left-0 top-0 z-0 hidden lg:fixed lg:block" />

      <IbImage
        :img="{
          src: '/astron-era-hero.jpg',
          alt: '',
        }"
        class="min-h-full w-full object-cover object-center"
      />
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
