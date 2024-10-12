<!-- pages/[...404].vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <PrimeCard>
      <h1 class="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
      <h2 class="text-2xl text-gray-600 dark:text-gray-400 mb-8">Page Not Found</h2>
      <PrimeButton
        class="p-button-lg"
        @click="goHome"
      >
        Go Home
        <Icon
          name="mdi:home"
          class="ml-2"
        />
      </PrimeButton>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

useHead({
  title: '404 - Page Not Found',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
