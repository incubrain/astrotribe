<script setup lang="ts">
const catTagStore = useCategoryTagStore()
const currentUser = useCurrentUser()

onMounted(() => {
  document.documentElement.classList.add('dark')
})

onMounted(async () => {
  await catTagStore.getCategories()
  await catTagStore.getTags()
})

const supabase = useSupabaseClient()
supabase.auth.onAuthStateChange((event, session) => {
  setTimeout(async () => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('TOKEN_REFRESHED', session)
      await currentUser.loadSession()
      // Use webhooks/database for role/plan changes to trigger new session
    } else if (event === 'SIGNED_OUT') {
      console.log('SIGNED_OUT')
      currentUser.removeSession()
    } else if (event === 'PASSWORD_RECOVERY') {
      console.log('PASSWORD_RECOVERY: TRIGGER')
      // Handle password recovery event
    } else if (event === 'INITIAL_SESSION') {
      await currentUser.loadSession()
    } else if (event === 'SIGNED_IN') {
      console.log('SIGNED_IN: TRIGGER')
    }
  }, 0)
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PrimeToast position="bottom-right" />
    <IBAdminTools v-if="false" />
    <!-- currentUser.isAdmin -->
    <!-- <DevComponentPlayground v-if="showPlayground" /> -->

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
