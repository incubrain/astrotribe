<template>
  <div class="flex flex-col items-center justify-center p-4 h-full">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="flex justify-center">
        <Icon
          name="material-symbols:wifi-off"
          class="w-20 h-20"
        />
      </div>

      <h1 class="text-3xl font-bold"> No Internet Connection </h1>

      <div class="space-y-4">
        <p class="">
          The page you're trying to access requires an internet connection. Please check your
          connection and try again.
        </p>

        <Button
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="reload"
        >
          Try Again
        </Button>
      </div>

      <div class="text-sm">
        <p>Some features may still be available offline</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $isOffline } = useNuxtApp()

// Watch for online status changes
watch($isOffline, (offline) => {
  if (!offline) {
    // Optionally reload when connection is restored
    window.location.reload()
  }
})

const reload = () => {
  window.location.reload()
}
</script>
