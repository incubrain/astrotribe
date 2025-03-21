<script setup lang="ts">
import { ref } from 'vue'

// Define props for the component
const props = defineProps({
  title: {
    type: String,
    default: 'Research Process',
  },
  oldWay: {
    type: Object,
    required: true,
    // Expected format: { title: string, description: string, steps: string[], timeframe: string }
  },
  newWay: {
    type: Object,
    required: true,
    // Expected format: { title: string, description: string, steps: string[], timeframe: string }
  },
})

// Active tab state
const activeTab = ref('new') // 'old' or 'new'
</script>

<template>
  <div class="comparison-container max-w-5xl mx-auto">
    <h3 class="text-2xl font-bold text-white mb-6 text-center">{{ title }}</h3>

    <!-- Tab selector -->
    <div class="flex justify-center mb-8">
      <div
        class="inline-flex bg-slate-900/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-800/50"
      >
        <button
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
          :class="
            activeTab === 'old'
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeTab = 'old'"
        >
          <Icon
            name="mdi:clock-time-eight-outline"
            size="18"
          />
          <span>Traditional Way</span>
        </button>

        <button
          class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
          :class="
            activeTab === 'new'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-gray-400 hover:text-white'
          "
          @click="activeTab = 'new'"
        >
          <Icon
            name="mdi:rocket-launch-outline"
            size="18"
          />
          <span>AstroQuery Way</span>
        </button>
      </div>
    </div>

    <!-- Comparison cards -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Old Way Card -->
      <div
        class="transition-all duration-500 transform"
        :class="activeTab === 'old' ? 'md:scale-105 z-10' : 'md:scale-95 opacity-60'"
      >
        <div
          class="bg-slate-900/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300"
          :class="
            activeTab === 'old'
              ? 'border-red-600/30 shadow-xl shadow-red-900/10'
              : 'border-slate-800/50'
          "
        >
          <div class="bg-slate-800/60 px-6 py-4 border-b border-slate-700/50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                <Icon
                  name="mdi:clock-time-eight-outline"
                  class="text-red-500"
                  size="18"
                />
              </div>
              <h4 class="text-lg font-medium text-white">{{ oldWay.title }}</h4>
            </div>
          </div>

          <div class="p-6">
            <p class="text-gray-300 mb-6">{{ oldWay.description }}</p>

            <div class="mb-6">
              <h5 class="text-white font-medium mb-3 text-sm uppercase tracking-wider">Process</h5>
              <ol class="space-y-3">
                <li
                  v-for="(step, index) in oldWay.steps"
                  :key="`old-${index}`"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700/50"
                  >
                    <span class="text-gray-400 text-xs">{{ index + 1 }}</span>
                  </div>
                  <span class="text-gray-300">{{ step }}</span>
                </li>
              </ol>
            </div>

            <div class="bg-slate-800/60 rounded-lg p-4 flex items-center justify-between">
              <span class="text-gray-400 text-sm">Average Time</span>
              <span class="text-red-500 font-medium">{{ oldWay.timeframe }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- New Way Card -->
      <div
        class="transition-all duration-500 transform"
        :class="activeTab === 'new' ? 'md:scale-105 z-10' : 'md:scale-95 opacity-60'"
      >
        <div
          class="bg-slate-900/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300"
          :class="
            activeTab === 'new'
              ? 'border-blue-600/30 shadow-xl shadow-blue-900/10'
              : 'border-slate-800/50'
          "
        >
          <div class="bg-slate-800/60 px-6 py-4 border-b border-slate-700/50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Icon
                  name="mdi:rocket-launch-outline"
                  class="text-blue-500"
                  size="18"
                />
              </div>
              <h4 class="text-lg font-medium text-white">{{ newWay.title }}</h4>
            </div>
          </div>

          <div class="p-6">
            <p class="text-gray-300 mb-6">{{ newWay.description }}</p>

            <div class="mb-6">
              <h5 class="text-white font-medium mb-3 text-sm uppercase tracking-wider">Process</h5>
              <ol class="space-y-3">
                <li
                  v-for="(step, index) in newWay.steps"
                  :key="`new-${index}`"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-800/30"
                  >
                    <span class="text-blue-400 text-xs">{{ index + 1 }}</span>
                  </div>
                  <span class="text-gray-300">{{ step }}</span>
                </li>
              </ol>
            </div>

            <div class="bg-slate-800/60 rounded-lg p-4 flex items-center justify-between">
              <span class="text-gray-400 text-sm">Average Time</span>
              <span class="text-blue-500 font-medium">{{ newWay.timeframe }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time savings callout -->
    <div
      v-if="activeTab === 'new'"
      class="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg text-center"
    >
      <p class="text-blue-400">
        <span class="font-bold">Save time and resources</span> with AstroQuery's streamlined
        approach
      </p>
    </div>

    <div
      v-if="activeTab === 'old'"
      class="mt-8 p-4 bg-red-900/20 border border-red-800/30 rounded-lg text-center"
    >
      <p class="text-red-400">
        <span class="font-bold">Don't waste time</span> on tedious, manual research processes
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
