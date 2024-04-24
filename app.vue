<script setup lang="ts">
const catTagStore = useCategoryTagStore()

onMounted(async () => {
  await catTagStore.getCategories()
  await catTagStore.getTags()
})
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

// infra:med:med:2 setup feature flags for posthog
// ui:low:easy:1 - add styling to the toasts, specifically dark mode
// !infra:med:hard:4 - add an event emitter using kafka or rabbitmq, or a simple pubsub to server
</script>

<template>
  <div class="w-full h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PrimeToast
      position="bottom-right"
      :pt="{
        content: 'border border-color rounded-md shadow-md flex'
      }"
    />
  </div>
</template>

<style>
html {
  margin: 0;
  padding: 0;
}

#__nuxt {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
