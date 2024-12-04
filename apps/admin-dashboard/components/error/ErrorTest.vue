<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-4">
      <PrimeButton
        :loading="loading"
        severity="danger"
        @click="triggerError"
      >
        Trigger Test Error
      </PrimeButton>
    </div>

    <!-- Error Message Display -->
    <div
      v-if="errorMessage"
      class="bg-red-50 border border-red-200 rounded-md p-4"
    >
      <h3 class="text-red-800 font-medium">Last Error:</h3>
      <p class="text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- Success Message Display -->
    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 rounded-md p-4"
    >
      <p class="text-green-600">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCentralizedLogger } from '@ib/logger'

const logger = createCentralizedLogger('error-test')
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const simulateAsyncOperation = () => {
  return new Promise((resolve, reject) => {
    const shouldFail = true // Set to true to always trigger error
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Simulated API failure'))
      } else {
        resolve('Success')
      }
    }, 1000)
  })
}

const triggerError = async () => {
  clearMessages()
  loading.value = true

  try {
    await simulateAsyncOperation()
  } catch (error: any) {
    // Log the error
    logger.error('Test error triggered', {
      type: 'TEST_ERROR',
      context: {
        action: 'testErrorTrigger',
        component: 'ErrorTestComponent',
      },
      metadata: {
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        path: window.location.pathname,
      },
      error: {
        message: error.message,
        stack: error.stack,
      },
    })

    errorMessage.value = `Error logged: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>
