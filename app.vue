<template>
  <div class="w-full h-full">
    <div class="fixed top-0 left-0 md:px-4 md:pt-4 z-50 w-full">
      <NavTop />
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <FooterWebsite v-if="!noFooter.some((noFooterPath) => $route.path.startsWith(noFooterPath))" />
    <PrimeToast life="4000" />
  </div>
</template>

<script setup lang="ts">
const noFooter = ['/contact', '/auth', '/astrotribe']

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
</script>

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
</style>
