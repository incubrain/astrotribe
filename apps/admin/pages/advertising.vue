<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Advertising',
})

const tabs = [
  {
    title: 'Ads Dashboard',
    slotName: 'dashboard',
    value: 'dashboard',
  },
  {
    title: 'Ads Preview',
    slotName: 'preview',
    value: 'preview',
  },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Tabs Container -->
    <div class="h-[calc(100vh-73px)]">
      <!-- 73px accounts for header height -->
      <IBTabView :tabs="tabs">
        <template #start>
          <h1 class="text-xl font-semibold text-white">Error Monitoring</h1>
        </template>

        <template #dashboard>
          <AdsAdminDashboard />
        </template>

        <template #preview>
          <AdsAdminPreview />
        </template>
      </IBTabView>
    </div>
  </div>
</template>

<style scoped></style>
