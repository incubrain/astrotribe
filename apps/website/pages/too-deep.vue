<!-- pages/too-deep.vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <PrimeCard>
      <template #title>
        <h1 class="text-4xl font-bold mb-4">Path Too Deep</h1>
      </template>
      <template #content>
        <p class="text-xl mb-8">
          The requested URL contains too many nested paths. <br />
          Please try a shorter URL or navigate from our homepage.
        </p>
        <PrimeButton
            class="w-full"
          @click="goHome"
        >
          Go Home
          <Icon
            name="mdi:home"
            class="ml-2"
          />
        </PrimeButton>
      </template>
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
  title: 'Path Too Deep',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
