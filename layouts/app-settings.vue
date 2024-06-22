<script setup lang="ts">
const currentUserId = useRoute().params.id

const settingsRoutes = computed(() => [
  {
    key: 'settings-account',
    label: 'Account Profile',
    url: `/astrotribe/users/${currentUserId}/settings/profile`,
    icon: 'material-symbols:home',
    visible: true,
    disabled: false
  },
  {
    key: 'settings-password',
    label: 'Update Password',
    url: `/astrotribe/users/${currentUserId}/settings/password`,
    icon: 'material-symbols:key',
    visible: true,
    disabled: false
  },
  {
    key: 'settings-application',
    label: 'Application',
    url: `/astrotribe/users/${currentUserId}/settings/application`,
    icon: 'material-symbols:laptop-mac-outline',
    visible: true,
    disabled: true
  },
  {
    key: 'settings-notifications',
    label: 'Notifications',
    url: `/astrotribe/users/${currentUserId}/settings/notifications`,
    icon: 'material-symbols:notifications',
    visible: true,
    disabled: true
  }
])
</script>

<template>
  <div>
    <NuxtLayout name="app">
      <div class="flex flex-col md:flex-row md:gap-8">
        <PrimeMenu
          :model="settingsRoutes"
          :pt="{
            root: 'border-none bg-transparent relative',
            menu: 'md:sticky md:top-0 flex py-4 px-2 md:flex-col justify-left w-full items-center md:justify-end md:items-end overflow-scroll',
            menuitem: 'rounded-full'
          }"
        >
          <template #item="{ item }">
            <NuxtLink
              v-if="item.url"
              v-ripple
              :to="item.url"
              exact-active-class="bg-primary-950 text-white"
              class="flex gap-2 py-2 px-3 rounded-md"
            >
              <span class="md:mr-4 text-nowrap">{{ item.label }}</span>
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
