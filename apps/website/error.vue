<script setup lang="ts">
const props = defineProps({
  error: Object,
})

const handleError = () => {
  clearError()
}
</script>

<template>
  <div class="wrapper py-8 text-center">
    <h1 class="text-2xl font-bold">
      {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
    </h1>
    <p class="mt-4">{{ error?.message }}</p>
    <button
      class="mt-4 px-4 py-2 bg-primary text-white rounded"
      @click="handleError"
    >
      Try Again
    </button>
  </div>
</template>
