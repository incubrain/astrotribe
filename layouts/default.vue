<template>
  <div class="w-full min-h-screen foreground relative">
    <NavTop v-if="showTopNav" />
    <AppBackButton
      v-else
      class="fixed bottom-2 left-2 z-50"
    />
    <slot />
    <FooterWebsite v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const noTopNav = ['/contact']
const noFooter = ['/contact']

const showFooter = computed(
  () => !noFooter.some((noFooterPath) => route.path.startsWith(noFooterPath))
)

const showTopNav = computed(
  () => !noTopNav.some((noTopNavPath) => route.path.startsWith(noTopNavPath))
)
</script>

<style></style>
