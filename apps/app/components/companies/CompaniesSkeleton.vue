<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="index in 8"
      :key="index"
      class="animate-pulse bg-primary-900/50 border border-primary-800/30 rounded-lg overflow-hidden"
    >
      <!-- Image skeleton -->
      <div class="h-40 bg-primary-800/70"></div>

      <!-- Content skeleton -->
      <div class="p-4 space-y-4">
        <!-- Title and tags -->
        <div>
          <div class="h-6 bg-primary-800/70 rounded w-3/4 mb-3"></div>
          <div class="flex gap-2">
            <div class="h-5 bg-primary-800/70 rounded-full w-20"></div>
            <div class="h-5 bg-primary-800/70 rounded-full w-16"></div>
          </div>
          <div class="h-4 bg-primary-800/70 rounded w-1/2 mt-2"></div>
        </div>

        <!-- Description -->
        <div>
          <div class="h-4 bg-primary-800/70 rounded w-full mb-2"></div>
          <div class="h-4 bg-primary-800/70 rounded w-full mb-2"></div>
          <div class="h-4 bg-primary-800/70 rounded w-2/3"></div>
        </div>

        <!-- Keywords -->
        <div class="flex gap-2">
          <div class="h-5 bg-primary-800/70 rounded-full w-16"></div>
          <div class="h-5 bg-primary-800/70 rounded-full w-20"></div>
          <div class="h-5 bg-primary-800/70 rounded-full w-14"></div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center">
          <div class="flex space-x-1">
            <div class="w-7 h-7 bg-primary-800/70 rounded-full"></div>
            <div class="w-7 h-7 bg-primary-800/70 rounded-full"></div>
          </div>
          <div class="h-6 bg-primary-800/70 rounded-full w-14"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
