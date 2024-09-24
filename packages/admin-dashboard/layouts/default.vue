<script setup lang="ts">
const adminLinks = ref([
  {
    id: 0,
    label: 'App',
    slug: '/',
    icon: 'mdi:application',
  },
  {
    id: 1,
    label: 'Dashboard',
    slug: '/',
    icon: 'mdi:view-dashboard',
    children: [],
  },
  {
    id: 2,
    label: 'Users',
    slug: '/users',
    icon: 'mdi:account',
    children: [],
  },
  {
    id: 4,
    label: 'Analytics',
    slug: '/analytics',
    icon: 'mdi:chart-bar',
    children: [],
  },
  {
    id: 5,
    label: 'Timeline',
    slug: '/timeline',
    icon: 'mdi:chart-bar',
    children: [],
  },
  {
    id: 6,
    label: 'BP',
    slug: '/business-plan',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 7,
    label: 'Spider',
    slug: '/spider',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 8,
    label: 'Cache',
    slug: '/redis',
    icon: 'mdi:chat',
    children: [],
  },
  {
    id: 9,
    label: 'Errors',
    slug: '/errors',
    icon: 'mdi:bug',
    children: [],
  },
  {
    id: 10,
    label: 'Growth',
    slug: '/growth',
    icon: 'mdi:account',
    children: [],
  },
  {
    id: 11,
    label: 'Financials',
    slug: '/financials',
    icon: 'material-symbols:attach-money',
    children: [],
  },
  {
    id: 12,
    label: 'Classifier',
    slug: '/classifier',
    icon: 'mdi:application',
  },
  // {
  //   id: 3,
  //   label: 'Upload',
  //   slug: '/upload',
  //   icon: 'mdi:upload',
  //   children: []
  // },
  // {
  //   id: 5,
  //   label: 'Socials',
  //   slug: '/socials',
  //   icon: 'mdi:chart-bar',
  //   children: []
  // },
  {
    id: 11,
    label: 'Systems',
    slug: '/business-systems',
    icon: 'mdi:chat',
    children: [
      {
        id: 71,
        label: 'Users',
        slug: '/business-systems/users',
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
    <div class="foreground h-full w-full overflow-y-scroll rounded-lg md:ml-[60px]">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
