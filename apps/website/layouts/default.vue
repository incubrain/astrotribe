<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="foreground relative min-h-screen w-full">
    <NavTop />

    <div class="relative">
      <div class="relative z-10">
        <slot />
      </div>
      <ClientOnly>
        <IBBackground class="left-0 top-0 z-0 hidden opacity-50 lg:fixed lg:block" />
      </ClientOnly>
    </div>

    <div class="relative w-full">
      <FooterWebsite />
    </div>
  </div>
</template>

<style></style>
