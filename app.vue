<script setup lang="ts">
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
// !todo:med - add styling to the toasts, specifically dark mode
// !todo:med - add a version of this logger to the server using consola, pino or winston logger
// todo:med - add an event emitter using kafka or rabbitmq, or a simple pubsub to server
// todo:critical:med - add pagination util for the server, should have the state stored in app state

</script>

<template>
  <div class="w-full h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PrimeToast position="bottom-right" />
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
