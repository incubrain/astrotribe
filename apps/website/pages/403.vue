<template>
  <div class="flex items-center justify-center min-h-screen">
    <PrimeCard class="w-full max-w-md">
      <template #title>
        <div class="flex items-center justify-center text-2xl font-bold">
          <Icon
            name="mdi:alert-circle"
            class="mr-2"
          />
          <span>403 Forbidden</span>
        </div>
      </template>
      <template #content>
        <div class="text-center">
          <p class="mb-6">
            Access to this resource is forbidden. If you believe this is an error, please contact
            the site administrator.
          </p>
          <PrimeButton
            label="Go to Homepage"
            class="w-full"
            @click="goHome"
          >
            <template #icon>
              <Icon name="mdi:home" />
            </template>
          </PrimeButton>
        </div>
      </template>
    </PrimeCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = (): void => {
  router.push('/')
}

useHead({
  title: '403 Forbidden',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
