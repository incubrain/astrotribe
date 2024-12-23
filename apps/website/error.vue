<template>
  <div class="flex h-auto items-center justify-center foreground min-h-screen">
    <div class="max-w-md rounded-lg p-8 shadow-lg background">
      <h1 class="mb-4 text-3xl font-bold text-red-800">An error occurred</h1>
      <p class="text-lg mb-4">
        {{ error?.message || error }}
      </p>
      <p
        v-if="error?.errorId"
        class="mb-2 text-sm text-gray-600"
      >
        Error ID: {{ error.errorId }}
      </p>
      <p
        v-if="error?.stack"
        class="mb-4 overflow-auto text-xs text-gray-500"
      >
        <strong>Stack trace:</strong><br />
        {{ error.stack }}
      </p>
      <div class="flex justify-between">
        <button
          v-if="error?.retryAction"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          @click="handleRetry"
        >
          Retry
        </button>
        <button
          class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          @click="handleHome"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: Error | any
}>()

const router = useRouter()

const handleRetry = () => {
  if (props.error?.retryAction && typeof props.error.retryAction === 'function') {
    props.error.retryAction()
  }
}

const handleHome = () => {
  clearError()
  router.push('/')
}
</script>
