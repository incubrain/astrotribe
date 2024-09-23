<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Business Systems',
  
  middleware: 'is-admin',
})

const systemsTabs = [
  {
    title: 'Auth',
    slotName: 'auth',
    value: '0',
    system: 'authentication-flow',
  },
  {
    title: 'News',
    slotName: 'news',
    value: '1',
    system: 'news-feed',
  },
]
</script>

<template>
  <div>
    <IBTabView
      ref="analyticsTabView"
      :tabs="systemsTabs"
    >
      <template
        v-for="tab in systemsTabs"
        :key="tab.slotName"
        #[tab.slotName]
      >
        <AdminBusinessSystems :system-name="tab.system" />
      </template>
    </IBTabView>
  </div>
</template>

<style scoped></style>
