<script setup lang="ts">
import { useNewsStore } from '@/stores/useNewsStore'

const newsStore = useNewsStore()
</script>

<template>
  <div class="flex items-center gap-2">
    <PrimeButton
      icon="mdi:view-grid"
      :outlined="newsStore.viewMode !== 'grid'"
      :class="newsStore.viewMode === 'grid' ? 'bg-primary-600' : ''"
      @click="newsStore.viewMode = 'grid'"
    />
    <PrimeButton
      icon="mdi:view-list"
      :outlined="newsStore.viewMode !== 'list'"
      :class="newsStore.viewMode === 'list' ? 'bg-primary-600' : ''"
      @click="newsStore.viewMode = 'list'"
    />
  </div>
</template>
