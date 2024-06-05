<script setup lang="ts">
const catTagStore = useCategoryTagStore()
const currentUser = useCurrentUser()

onMounted(() => {
  // FORCE DARK MODE
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
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <PrimeToast
      position="bottom-right"
      :pt="{
        content: 'border border-color rounded-md shadow-md flex'
      }"
    />
    <Notification />
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
