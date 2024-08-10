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

// !todo: important - add a CTA at the bottom of default layout
// probably for app signup, but also consider adding email list signup
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
      <AppBackground class="left-0 top-0 z-0 hidden opacity-50 lg:fixed lg:block" />
    </div>

    <FooterWebsite v-if="showFooter" />
  </div>
</template>

<style></style>
