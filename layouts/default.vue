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
  <div class="w-full min-h-screen foreground relative">
    <NavTop v-if="showTopNav" class="wrapper padded-x" />
    <AppBackButton
      v-else
      class="fixed bottom-2 left-2 z-50"
    />
    <div class="relative">
      <div class="relative z-10">
        <slot />
      </div>
      <AppBackground class="fixed z-0 top-0 left-0 opacity-50" />
    </div>

    <FooterWebsite v-if="showFooter" />
  </div>
</template>

<style></style>
