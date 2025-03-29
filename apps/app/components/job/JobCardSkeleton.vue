<template>
  <div class="relative h-full overflow-hidden animate-pulse">
    <div
      class="group bg-primary bg-opacity-20 hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-jobs-primary/20 rounded-2xl"
    >
      <!-- Featured badge skeleton -->
      <div class="absolute -top-3 -left-3 z-10">
        <div class="relative w-5 h-5 bg-gray-700 rounded-full"></div>
      </div>

      <div class="flex justify-between items-start relative gap-4">
        <!-- Title skeleton -->
        <div class="space-y-1 w-full">
          <div class="h-6 w-3/4 bg-gray-700 rounded-md"></div>
          <div class="flex flex-col">
            <div class="h-4 w-1/2 bg-gray-700 rounded-md mt-2"></div>
            <div class="h-4 w-1/3 bg-gray-700 rounded-md mt-2"></div>
          </div>
        </div>

        <!-- Salary skeleton -->
        <div class="h-8 w-20 bg-gray-700 rounded-full flex-shrink-0"></div>
      </div>

      <!-- Location skeleton -->
      <div class="mt-6 flex items-center text-gray-600 space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div class="h-4 w-32 bg-gray-700 rounded-md"></div>
        </div>
      </div>

      <!-- Date skeleton -->
      <div class="flex items-center space-x-2 mt-2">
        <div class="w-4 h-4 bg-gray-700 rounded-full"></div>
        <div class="h-4 w-24 bg-gray-700 rounded-md"></div>
      </div>

      <!-- Tags skeleton -->
      <div class="mt-6 flex flex-wrap gap-2">
        <div class="h-6 w-16 bg-gray-700 rounded-full"></div>
        <div class="h-6 w-20 bg-gray-700 rounded-full"></div>
        <div class="h-6 w-14 bg-gray-700 rounded-full"></div>
      </div>

      <!-- Button skeleton -->
      <div class="mt-6 h-12 w-full bg-gray-700 rounded-xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for skeleton component
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
