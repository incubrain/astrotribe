<template>
  <div class="flex h-auto items-center justify-center bg-gray-100">
    <div class="max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-4 text-3xl font-bold text-red-600">
        An error occurred
      </h1>
      <p class="text-lg mb-4">
        {{ error.message }}
      </p>
      <p class="mb-2 text-sm text-gray-600">
        Error ID: {{ error.errorId }}
      </p>
      <p
        v-if="error.stack"
        class="mb-4 overflow-auto text-xs text-gray-500"
      >
        <strong>Stack trace:</strong><br >
        {{ error.stack }}
      </p>
      <div class="flex justify-between">
        <button
          v-if="error.retryAction"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="retryAction"
        >
          Retry
        </button>
        <button
          class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          @click="goHome"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
})

const retryAction = () => {
  if (props.error.retryAction) {
    props.error.retryAction()
  }
}

const goHome = () => {
  clearError({ redirect: '/' })
}
</script>
