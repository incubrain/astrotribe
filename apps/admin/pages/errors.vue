<script setup lang="ts">
const logger = useLogger('TESTER')
definePageMeta({
  layoutTransition: false,
  name: 'Errors',
})

const tabs = [
  {
    title: 'Dashboard',
    slotName: 'dashboard',
    value: 'dashboard',
  },
  {
    title: 'Logs',
    slotName: 'logs',
    value: 'logs',
  },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Tabs Container -->
    <div class="h-[calc(100vh-73px)]">
      <!-- 73px accounts for header height -->
      <IBTabView
        v-model:active-tab="activeTab"
        :tabs="tabs"
      >
        <template #start>
          <h1 class="text-xl font-semibold text-white">Error Monitoring</h1>
        </template>

        <template #dashboard>
          <ErrorDashboard />
        </template>

        <template #logs>
          <ErrorLogs />
        </template>
      </IBTabView>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-tabview-panels) {
  padding: 0 !important;
}

:deep(.p-tabview-nav) {
  border-bottom: 1px solid rgb(63 63 70) !important;
}

:deep(.p-tabview-nav-content) {
  border-bottom: none !important;
}
</style>
