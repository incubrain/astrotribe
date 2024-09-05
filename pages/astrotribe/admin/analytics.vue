<script setup lang="ts">
const analyticsTabs = [
  {
    title: 'Realtime',
    slotName: 'realtime',
    value: '0',
    src: 'https://us.posthog.com/embedded/qZ7aQk6ZyuCEp0npTLkWkOu3geB5eA?whitelabel'
  },
  {
    title: 'Dashboard',
    slotName: 'dashboard',
    value: '1',
    src: 'https://us.posthog.com/embedded/Za4dgg7lpaDSZhmoPIlJE8-724hqiw?whitelabel'
  },
  {
    title: 'Landing Page',
    slotName: 'landingPage',
    value: '2',
    src: 'https://us.posthog.com/embedded/6suXX7B2fY6uvr1oCCVo-KsU3g--1A?whitelabel'
  },
  {
    title: 'Growth',
    slotName: 'growth',
    value: '3',
    src: 'https://us.posthog.com/embedded/5U8l5Qu1ougk0m5i_RvLgMAPWnXx5A?whitelabel'
  },
  {
    title: 'Users',
    slotName: 'users',
    value: '4',
    src: 'https://us.posthog.com/embedded/5_O5m7upw1QjlBHMIcr0MVp_Q_HX8w?whitelabel'
  }
]

const analyticsTabView = ref<HTMLElement | null>(null)
const activeTab = ref('0')
const analyticsHeight = ref(500) // Start with a default height

const updateHeight = async () => {
  await nextTick()
  if (analyticsTabView.value) {
    const newHeight = analyticsTabView.value.clientHeight
    analyticsHeight.value = newHeight > 0 ? newHeight : analyticsHeight.value
  }
}

const handleIframeLoad = (event: Event) => {
  const iframe = event.target as HTMLIFrameElement
  updateHeight()

  // Set up a MutationObserver to watch for changes in the iframe content
  const observer = new MutationObserver(updateHeight)
  observer.observe(iframe.contentDocument?.body || iframe, { childList: true, subtree: true })
}

// Update height when tab changes
watch(activeTab, updateHeight)

// Initial height update
onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

definePageMeta({
  layoutTransition: false,
  name: 'Analytics',
  middleware: 'is-admin'
})
</script>
<template>
  <IBTabView
    ref="analyticsTabView"
    :tabs="analyticsTabs"
    class="h-full min-h-full w-full"
  >
    <template
      v-for="tab in analyticsTabs"
      #[tab.slotName]
    >
      <div class="h-full min-h-full">
        <iframe
          class="p-4 invert"
          width="100%"
          height="100%"
          :src="tab.src"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </template>
  </IBTabView>
</template>

<style scoped></style>
