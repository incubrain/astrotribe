<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="flex justify-center">
        <Icon
          name="material-symbols:wifi-off"
          class="w-20 h-20 text-gray-400"
        />
      </div>

      <h1 class="text-3xl font-bold text-gray-900"> No Internet Connection </h1>

      <div class="space-y-4">
        <p class="text-gray-600">
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

      <div class="text-sm text-gray-500">
        <p>Some features may still be available offline</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const reload = () => {
  window.location.reload()
}
</script>
