<script setup lang="ts">
</script>

<template>
  <div class="h-full w-full">
    <NuxtLoadingIndicator />
    <!-- <AdsPopupTrigger /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- <ReferralCapture /> -->
    <!-- <PrimeToast position="bottom-right" /> -->
  </div>
</template>

<style>
html {
  margin: 0;
  padding: 0;
}

#__nuxt {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
