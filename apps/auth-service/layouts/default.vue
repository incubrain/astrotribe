<script setup lang="ts">
const isAuthenticating = ref(true)
onMounted(async () => {
  const toast = useNotification()
  const supabase = useSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (!data.session || error) {
    isAuthenticating.value = false
  } else {
    toast.success({ summary: 'Authenticated', message: 'Found user session' })
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
})

// !todo:consider:2 - add a delay to function execution, fade out the auth cards so the bg image is fully visible for a few seconds, then execute
// !todo:low:1 - add transitions to the auth cards
// !todo:high:1 - add subtitle prompt to all auth cards
// !todo:med:2 - handle session expired, redirect to login with explanation
</script>

<template>
  <div
    v-if="isAuthenticating"
    class="text-white w-screen flex justify-center items-center absolute h-screen z-50 bg-black bg-opacity-50"
    >Looking for a session...</div
  >
  <div
    :class="{ 'pointer-events-none': isAuthenticating }"
    class="relative flex h-full min-h-screen w-full items-center justify-start"
  >
    <div class="foreground relative z-20 min-h-lvh w-full min-w-[340px] max-w-[480px] p-4">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </div>
    <div class="absolute left-0 top-0 flex h-full w-full">
      <div class="absolute left-0 top-0 h-full w-full bg-black/40" />
      <IBBackground class="left-0 top-0 z-0 hidden lg:fixed lg:block" />

      <IBImage
        :img="{
          src: '/astron-era-hero.jpg',
          alt: '',
        }"
        class="min-h-full w-full object-cover object-center"
      />
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
