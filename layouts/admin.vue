<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useServerAnalyticsStore, usePages } from '#imports'

const serverAnalyticsStore = useServerAnalyticsStore()

onMounted(() => {
  serverAnalyticsStore.connectWebSocket()
  serverAnalyticsStore.subscribeToMetrics(['all'])
})

onUnmounted(() => {
  serverAnalyticsStore.disconnectWebSocket()
})

const { adminLinks } = usePages()
</script>

<template>
  <div class="background relative flex h-screen w-full lg:p-4 lg:pl-0">
    <IbSideNav :links="adminLinks" />
    <div class="foreground h-full w-full overflow-y-scroll rounded-lg lg:ml-[60px]">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
