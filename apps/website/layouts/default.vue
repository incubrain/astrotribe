<script setup lang="ts">
const route = useRoute()
const noTopNav = ['/contact']
const noFooter = ['/contact']

const showFooter = computed(
  () => !noFooter.some((noFooterPath) => route.path.startsWith(noFooterPath)),
)

const showTopNav = computed(
  () => !noTopNav.some((noTopNavPath) => route.path.startsWith(noTopNavPath)),
)
</script>

<template>
  <div class="foreground relative min-h-screen w-full">
    <NavTop v-if="showTopNav" />
    <AppBackButton
      v-else
      class="fixed bottom-2 left-2 z-50"
    />
    <div class="relative">
      <div class="relative z-10">
        <slot />
      </div>
      <ClientOnly>
        <IBBackground class="left-0 top-0 z-0 hidden opacity-50 lg:fixed lg:block" />
      </ClientOnly>
    </div>

    <div class="relative w-full">
      <FooterWebsite v-if="showFooter" />
    </div>
  </div>
</template>

<style></style>
