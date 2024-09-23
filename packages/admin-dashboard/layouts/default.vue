<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useServerAnalyticsStore } from "#imports";

const serverAnalyticsStore = useServerAnalyticsStore();

onMounted(() => {
  serverAnalyticsStore.connectWebSocket();
  serverAnalyticsStore.subscribeToMetrics(["all"]);
});

onUnmounted(() => {
  serverAnalyticsStore.disconnectWebSocket();
});


const adminLinks = ref([
  {
    id: 0,
    label: 'App',
    slug: '/astrotribe',
    icon: 'mdi:application',
  },
  {
    id: 1,
    label: 'Dashboard',
    slug: '/astrotribe/admin',
    icon: 'mdi:view-dashboard',
    children: [],
  },
  {
    id: 2,
    label: 'Users',
    slug: '/astrotribe/admin/users',
    icon: 'mdi:account',
    children: [],
  },
  {
    id: 4,
    label: 'Analytics',
    slug: '/astrotribe/admin/analytics',
    icon: 'mdi:chart-bar',
    children: [],
  },
  {
    id: 5,
    label: 'Timeline',
    slug: '/astrotribe/admin/timeline',
    icon: 'mdi:chart-bar',
    children: [],
  },
  {
    id: 6,
    label: 'BP',
    slug: '/astrotribe/admin/business-plan',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 7,
    label: 'Spider',
    slug: '/astrotribe/admin/spider',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 8,
    label: 'Cache',
    slug: '/astrotribe/admin/redis',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 9,
    label: 'Errors',
    slug: '/astrotribe/admin/errors',
    icon: 'mdi:bug',
    children: [],
  },
  {
    id: 10,
    label: 'Growth',
    slug: '/astrotribe/admin/growth',
    icon: 'mdi:account',
    children: [],
  },
  {
    id: 11,
    label: 'Financials',
    slug: '/astrotribe/admin/financials',
    icon: 'material-symbols:attach-money',
    children: [],
  },
  {
    id: 12,
    label: 'Classifier',
    slug: '/astrotribe/admin/classifier',
    icon: 'mdi:application',
  },
  // {
  //   id: 3,
  //   label: 'Upload',
  //   slug: '/astrotribe/admin/upload',
  //   icon: 'mdi:upload',
  //   children: []
  // },
  // {
  //   id: 5,
  //   label: 'Socials',
  //   slug: '/astrotribe/admin/socials',
  //   icon: 'mdi:chart-bar',
  //   children: []
  // },
  {
    id: 11,
    label: 'Systems',
    slug: '/astrotribe/admin/business-systems',
    icon: 'mdi:chat',
    children: [
      {
        id: 71,
        label: 'Users',
        slug: '/astrotribe/admin/business-systems/users',
        icon: 'mdi:account',
        children: [],
      },
    ],
  },
])

</script>

<template>
  <div class="background relative flex h-screen w-full lg:p-4 lg:pl-0">
    <IBSideNav :links="adminLinks" />
    <div
      class="foreground h-full w-full overflow-y-scroll rounded-lg lg:ml-[60px]"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
