<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="foreground relative min-h-screen w-full">
    <NavTop />

    <div class="relative">
      <div class="relative z-10">
        <slot />
        <IBConsultationButton />
      </div>
      <ClientOnly fallback-tag="div">
        <IBBackground />
      </ClientOnly>
    </div>

    <div class="relative w-full">
      <NavFooter />
    </div>
  </div>
</template>

<style></style>
