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
    value: 4,
    src: 'https://us.posthog.com/embedded/5_O5m7upw1QjlBHMIcr0MVp_Q_HX8w?whitelabel'
  }
]

const analyticsTabView = ref(null as HTMLElement | null)
const wrapperHeight = computed(() => {
  if (document && analyticsTabView.value) {
    console.log('analyticsTabView', analyticsTabView.value)
    return analyticsTabView.value?.clientHeight
  } else return 0
})
const analyticsHeight = ref(0)

watch(wrapperHeight, (newHeight) => {
  analyticsHeight.value = newHeight || 0
  console.log('wrapperHeight', newHeight, analyticsHeight.value)
})

// const analyticsIframe = ref(null as HTMLIFrameElement | null)
// const onChange = (e) => {
//   if (e.data.event === 'posthog:dimensions' && e.data.name === 'AstronEraAnalytics') {
//     analyticsHeight.value = e.data.height
//   }
// }

definePageMeta({
  layoutTransition: false,
  name: 'Analytics',
  middleware: 'is-admin'
})
</script>
<template>
  <div class="relative h-full max-h-full">
    <BaseTabView
      ref="analyticsTabView"
      :tabs="analyticsTabs"
      class="h-full min-h-full w-full pb-4"
    >
      <template
        v-for="tab in analyticsTabs"
        v-slot:[tab.slotName]
      >
        <div class="h-full min-h-full p-4">
          <iframe
            class="invert"
            width="100%"
            :height="`${analyticsHeight}px`"
            :src="tab.src"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </template>
    </BaseTabView>
  </div>
</template>

<style scoped></style>
