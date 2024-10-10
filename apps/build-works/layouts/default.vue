<script setup lang="ts">
// !todo:consider:2 - add a delay to function execution, fade out the auth cards so the bg image is fully visible for a few seconds, then execute
// !todo:low:1 - add transitions to the auth cards
// !todo:high:1 - add subtitle prompt to all auth cards
// !todo:med:2 - handle session expired, redirect to login with explanation
</script>

<template>
  <div class="relative flex h-full min-h-screen w-full items-center justify-start">
    <div class="foreground relative z-20 min-h-lvh w-full p-4">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
