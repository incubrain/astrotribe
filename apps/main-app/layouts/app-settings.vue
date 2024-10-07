<script setup lang="ts">
const user = useCurrentUser()

const settingsRoutes = computed(() => [
  {
    key: 'settings-account',
    label: 'Account Profile',
    url: '/profile/settings/profile',
    icon: 'material-symbols:home',
    visible: true,
    disabled: false,
  },
  {
    key: 'settings-password',
    label: 'Update Password',
    url: '/profile/settings/password',
    icon: 'material-symbols:key',
    visible: user.profile?.providers.includes('email'),
    disabled: false,
  },
  {
    key: 'settings-payments',
    label: 'Payments',
    url: '/profile/settings/payments',
    icon: 'mdi:credit-card',
    visible: true,
    disabled: false,
  },
  {
    key: 'settings-notifications',
    label: 'Notifications',
    url: '/profile/settings/notifications',
    icon: 'material-symbols:notifications',
    visible: true,
    disabled: true,
  },
])
</script>

<template>
  <div>
    <NuxtLayout name="app">
      <AppBackButton class="rounded-none !justify-start !items-start" />
      <div class="overflow-auto h-screen flex flex-col p-4 bg-black md:flex-row md:gap-8 lg:p-8">
        <PrimeMenu
          :model="settingsRoutes"
          :pt="{
            root: 'border-none !bg-transparent relative md:w-64',
            list: 'md:sticky md:top-8 flex md:flex-col justify-left !w-full items-center md:justify-end md:items-end overflow-auto',
            item: 'w-full',
          }"
          :pt-options="{ mergeSections: true, mergeProps: true }"
        >
          <template #item="{ item }">
            <NuxtLink
              v-if="item.url && !item.disabled"
              v-ripple
              :to="item.url"
              exact-active-class="bg-primary-950 text-white w-full"
              class="flex w-full justify-between gap-2 rounded-md px-3 py-2"
            >
              <span class="text-nowrap md:mr-4">{{ item.label }}</span>
              <div class="hidden md:block">
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                />
              </div>
            </NuxtLink>
          </template>
        </PrimeMenu>
        <div class="flex-grow">
          <slot />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped></style>
