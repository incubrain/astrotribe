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
    'pageToMarkdownAnalytics'
  ])
})

onUnmounted(() => {
  serverAnalyticsStore.disconnectWebSocket()
})

const { adminLinks } = usePages()
</script>

<template>
  <div class="background relative flex h-screen w-full lg:p-4">
    <BaseSideNav :links="adminLinks" />
    <div class="w-full overflow-y-scroll h-full rounded-lg foreground">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
