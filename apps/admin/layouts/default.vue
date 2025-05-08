<script setup lang="ts">
const { appURL } = useRuntimeConfig().public

const adminLinks = ref([
  {
    id: 'main',
    label: 'Main Menu',
    items: [
      {
        id: 0,
        label: 'App',
        slug: appURL,
        icon: 'mdi:apps',
      },
      {
        id: 1,
        label: 'Dashboard',
        slug: '/',
        icon: 'mdi:view-dashboard-outline',
      },
      {
        id: 2,
        label: 'Growth',
        slug: '/growth',
        icon: 'mdi:trending-up',
      },
      {
        id: 3,
        label: 'Analytics',
        slug: '/analytics',
        icon: 'mdi:chart-line',
      },
      {
        id: 3,
        label: 'Permissions',
        slug: '/permissions',
        icon: 'mdi:shield-account',
      },
      // {
      //   id: 4,
      //   label: 'Users',
      //   slug: '/users',
      //   icon: 'mdi:account-group',
      // },
      // {
      //   id: 6,
      //   label: 'BP',
      //   slug: '/business-plan',
      //   icon: 'mdi:file-document-outline',
      // },
      // {
      //   id: 7,
      //   label: 'Spider',
      //   slug: '/spider',
      //   icon: 'mdi:spider-web',
      // },
      // {
      //   id: 8,
      //   label: 'Cache',
      //   slug: '/redis',
      //   icon: 'mdi:database',
      // },
      {
        id: 9,
        label: 'Errors',
        slug: '/errors',
        icon: 'mdi:alert-circle-outline',
      },
      {
        id: 10,
        label: 'Advertising',
        slug: '/advertising',
        icon: 'mdi:google-ads',
      },
      {
        id: 11,
        label: 'Financials',
        slug: '/financials',
        icon: 'mdi:currency-usd',
      },
      {
        id: 12,
        label: 'Referrals',
        slug: '/referrals',
        icon: 'mdi:account-multiple',
      },
      {
        id: 13,
        label: 'API Testing',
        slug: '/api-tester',
        icon: 'mdi:api',
      },
      // {
      //   id: 12,
      //   label: 'Classifier',
      //   slug: '/classifier',
      //   icon: 'mdi:tag-multiple',
      // },
      // {
      //   id: 11,
      //   label: 'Systems',
      //   slug: '/business-systems',
      //   icon: 'mdi:cog-outline',
      //   children: [
      //     {
      //       id: 71,
      //       label: 'Users',
      //       slug: '/business-systems/users',
      //       icon: 'mdi:account-cog',
      //     },
      //   ],
      // },
      {
        id: 81,
        label: 'Add Content Source',
        slug: '/add-content-source',
        icon: 'mdi:plus-thick',
      },
      {
        id: 82,
        label: 'Plans',
        slug: '/plans',
        icon: 'mdi:subscriptions',
      },
      {
        id: 83,
        label: 'Opportunities',
        slug: '/opportunities',
        icon: 'mdi:worker',
      },
    ],
  },
])
const { isSidebarOpen, isMobileSidebarOpen, isMobile } = useNavigation()
</script>

<template>
  <div class="h-screen flex background relative overflow-hidden lg:py-4 lg:pr-4">
    <IBMenuSidebar
      v-model:is-sidebar-open="isSidebarOpen"
      v-model:is-mobile-sidebar-open="isMobileSidebarOpen"
      :categories="adminLinks"
      :is-mobile="isMobile"
    />
    <div
      class="w-full h-full pb-[var(--mobi-bottom-nav-height)] foreground lg:pb-0 relative flex flex-col rounded-lg overflow-y-scroll"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
