<script setup lang="ts">
defineProps({
  layout: {
    type: String as () => 'grid' | 'list',
    default: 'grid',
  },
  count: {
    type: Number,
    default: 1,
  },
})
</script>

<template>
  <div
    v-for="n in count"
    :key="n"
    class="animate-pulse"
  >
    <div
      class="border border-primary-800/30 rounded-lg overflow-hidden"
      :class="layout === 'list' ? 'h-[200px] flex' : 'h-[450px]'"
    >
      <div
        class="p-4 flex flex-col h-full w-full"
        :class="layout === 'list' ? 'flex-row gap-4' : ''"
      >
        <div :class="layout === 'list' ? 'w-2/3' : 'w-full'">
          <!-- Category & Source -->
          <div class="flex items-center justify-between mb-3">
            <div class="bg-primary-800/50 h-5 w-24 rounded-full"></div>
            <div class="bg-primary-800/50 h-3 w-20 rounded"></div>
          </div>

          <!-- Title & Metadata -->
          <div class="space-y-2 mb-4">
            <div class="bg-primary-800/50 h-7 w-full rounded"></div>
            <div class="bg-primary-800/50 h-7 w-3/4 rounded"></div>
            <div
              v-if="layout !== 'list'"
              class="bg-primary-800/50 h-7 w-1/2 rounded"
            ></div>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-primary-800/50 h-3 w-16 rounded"></div>
            <div class="bg-primary-800/50 h-3 w-20 rounded"></div>
          </div>
        </div>

        <!-- Image and Actions -->
        <div :class="layout === 'list' ? 'w-1/3' : 'w-full'">
          <div
            v-if="layout !== 'list'"
            class="mb-4"
          >
            <div class="relative w-full pb-[56.25%]">
              <div class="absolute inset-0 bg-primary-800/50 rounded-lg"></div>
            </div>
          </div>

          <!-- Action bar -->
          <div class="flex items-center justify-between">
            <div class="bg-primary-800/50 h-8 w-20 rounded"></div>
            <div class="flex items-center gap-2">
              <div class="bg-primary-800/50 h-8 w-8 rounded"></div>
              <div class="bg-primary-800/50 h-8 w-8 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
