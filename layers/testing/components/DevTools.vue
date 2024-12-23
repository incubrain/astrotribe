<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const { $democker } = useNuxtApp()

const toggleDemocker = () => {
  $democker.configure({ enabled: !$democker.isEnabled() })
}

const currentMode = computed(() => $democker.getConfig().mode)

const setMode = (mode: 'light' | 'medium' | 'chaos') => {
  $democker.configure({ mode })
}

const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development'
</script>

<template>
  <div
    v-if="isDev"
    class="fixed bottom-4 right-4 z-50"
  >
    <!-- Toggle Button -->
    <button
      class="bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg transition-colors"
      @click="isVisible = !isVisible"
    >
      🔧
    </button>

    <!-- Controls Panel -->
    <div
      v-if="isVisible"
      class="absolute bottom-12 right-0 foreground rounded-lg shadow-lg p-4 min-w-[200px]"
    >
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Democker</span>
          <button
            :class="[
              'px-3 py-1 rounded text-sm',
              $democker.isEnabled()
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600',
              'text-white',
            ]"
            @click="toggleDemocker"
          >
            {{ $democker.isEnabled() ? 'Enabled' : 'Disabled' }}
          </button>
        </div>
      </div>

      <!-- Mode Selection -->
      <div class="space-y-2">
        <button
          v-for="mode in ['light', 'medium', 'chaos']"
          :key="mode"
          :class="[
            'w-full px-3 py-1 rounded text-sm',
            currentMode === mode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600',
          ]"
          @click="setMode(mode)"
        >
          {{ mode }} mode
        </button>
      </div>

      <!-- Error Count -->
      <div class="mt-4 text-sm">
        <div class="flex justify-between items-center">
          <span>Errors: {{ $democker.getErrorLog().length }}</span>
          <button
            class="text-xs text-blue-500 hover:text-blue-600"
            @click="() => console.table($democker.getErrorLog())"
          >
            View Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
