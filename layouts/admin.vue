<script setup lang="ts">
const serverAnalyticsStore = useServerAnalyticsStore()

onMounted(() => {
  serverAnalyticsStore.connectWebSocket()
  serverAnalyticsStore.subscribeToMetrics([
    'spiderMetrics',
    'jobMetrics',
    'paginationMetrics',
    'blogPostScraperMetrics',
    'resourceAnalytics',
    'pageToMarkdownAnalytics',
  ])
})

onUnmounted(() => {
  serverAnalyticsStore.disconnectWebSocket()
})

const { adminLinks } = usePages()
</script>

<template>
  <div class="background relative flex h-screen w-full lg:p-4">
    <IBSideNav :links="adminLinks" />
    <div class="foreground h-full w-full overflow-y-scroll rounded-lg">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
