<template>
  <div class="min-h-screen animate-pulse">
    <!-- Job header with subtle gradient skeleton -->
    <div class="relative h-[400px] rounded-t-lg overflow-hidden">
      <!-- Map skeleton -->
      <div class="absolute inset-0 z-0 bg-gray-800">
        <div class="h-full w-full flex items-center justify-center">
          <Icon
            name="heroicons:map"
            class="w-12 h-12 text-gray-700"
          />
        </div>
      </div>

      <!-- Content skeleton -->
      <div class="relative max-w-6xl mx-auto px-4 py-12 z-20">
        <!-- Breadcrumb skeleton -->
        <div class="flex items-center gap-2 text-sm mb-8">
          <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
          <div class="w-4 h-4 bg-gray-700 rounded-full"></div>
          <div class="h-4 w-32 bg-gray-700 rounded-md"></div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <!-- Left column skeleton -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="h-8 w-32 bg-gray-700 rounded-full"></div>
              <div class="h-6 w-48 bg-gray-700 rounded-md"></div>
            </div>

            <div class="h-10 w-3/4 bg-gray-700 rounded-md"></div>

            <div class="flex flex-wrap items-center gap-6">
              <div class="h-10 w-40 bg-gray-700 rounded-xl"></div>
              <div class="h-10 w-32 bg-gray-700 rounded-xl"></div>
            </div>
          </div>

          <!-- Right column skeleton -->
          <div class="lg:text-right space-y-6">
            <div class="flex lg:justify-end gap-3">
              <div class="h-14 w-32 bg-gray-700 rounded-xl"></div>
              <div class="h-14 w-14 bg-gray-700 rounded-xl"></div>
            </div>

            <div class="h-6 w-48 lg:ml-auto bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content skeleton -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Job description skeleton -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-gray-800 rounded-2xl p-8 space-y-4">
            <div class="h-6 w-1/2 bg-gray-700 rounded-md"></div>
            <div class="h-4 w-full bg-gray-700 rounded-md"></div>
            <div class="h-4 w-full bg-gray-700 rounded-md"></div>
            <div class="h-4 w-3/4 bg-gray-700 rounded-md"></div>
            <div class="h-6 w-1/3 bg-gray-700 rounded-md mt-8"></div>
            <div class="h-4 w-full bg-gray-700 rounded-md"></div>
            <div class="h-4 w-full bg-gray-700 rounded-md"></div>
            <div class="h-4 w-2/3 bg-gray-700 rounded-md"></div>
          </div>
        </div>

        <!-- Sidebar skeleton -->
        <div class="h-full">
          <div class="space-y-6">
            <!-- Company card skeleton -->
            <div class="bg-gray-800 rounded-2xl p-8 relative overflow-hidden">
              <div class="space-y-4">
                <div class="h-6 w-1/2 bg-gray-700 rounded-md"></div>
                <div class="h-4 w-full bg-gray-700 rounded-md"></div>
                <div class="h-4 w-full bg-gray-700 rounded-md"></div>
                <div class="h-4 w-3/4 bg-gray-700 rounded-md"></div>

                <div class="space-y-3 mt-4">
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div class="h-4 w-32 bg-gray-700 rounded-md"></div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div class="h-4 w-24 bg-gray-700 rounded-md"></div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div class="h-4 w-20 bg-gray-700 rounded-md"></div>
                  </div>
                </div>

                <div class="h-10 w-32 bg-gray-700 rounded-md mt-4"></div>
              </div>
            </div>

            <!-- Share skeleton -->
            <div class="bg-gray-800 rounded-2xl p-8">
              <div class="h-6 w-1/3 bg-gray-700 rounded-md mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <div class="h-16 bg-gray-700 rounded-xl"></div>
                <div class="h-16 bg-gray-700 rounded-xl"></div>
                <div class="h-16 bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
