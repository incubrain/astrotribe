<script setup lang="ts">
const catTagStore = useCategoryTagStore()
const currentUser = useCurrentUser()
const folderStore = useFolderStore()
const bookmarkStore = useBookmarkStore()

onMounted(async () => {
  document.documentElement.classList.add('dark')
  try {
    await Promise.all([folderStore.fetchFolders(), bookmarkStore.fetchBookmarks()])
    await bookmarkStore.fetchBookmarkCounts() // Add error handling here
  } catch (error) {
    console.error('Error initializing data:', error)
  }
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
})
</script>

<template>
  <div class="h-full w-full">
    <NuxtLoadingIndicator />
    <Head>
      <link
        rel="manifest"
        href="/manifest.webmanifest"
      />
    </Head>
    <NuxtPwaAssets />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PrimeToast position="bottom-right" />
    <ReferralCapture />
    <!-- <Notification /> -->
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
