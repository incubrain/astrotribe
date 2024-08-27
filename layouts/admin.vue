<script setup lang="ts">
const { connectWebSocket, disconnectWebSocket, subscribeToMetrics } = useServerAnalytics()

onMounted(() => {
  connectWebSocket()
  subscribeToMetrics([
    'spiderMetrics',
    'jobMetrics',
    'paginationMetrics',
    'blogPostScraperMetrics',
    'resourceAnalytics',
    'pageToMarkdownAnalytics'
  ])
})

onUnmounted(() => {
  disconnectWebSocket()
})

const { adminLinks } = usePages()
</script>

<template>
  <div class="background relative flex h-screen w-full overflow-scroll lg:p-4">
    <BaseSideNav :links="adminLinks" />
    <div class="foreground relative flex h-full w-full flex-col overflow-scroll rounded-lg">
      <div class="foreground h-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
