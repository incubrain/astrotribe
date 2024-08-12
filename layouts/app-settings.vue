<script setup lang="ts">
const settingsRoutes = computed(() => [
  {
    key: 'settings-account',
    label: 'Account Profile',
    url: `/astrotribe/profile/settings/profile`,
    icon: 'material-symbols:home',
    visible: true,
    disabled: false
  },
  {
    key: 'settings-password',
    label: 'Update Password',
    url: `/astrotribe/profile/settings/password`,
    icon: 'material-symbols:key',
    visible: true,
    disabled: false
  },
  {
    key: 'settings-application',
    label: 'Application',
    url: `/astrotribe/profile/settings/application`,
    icon: 'material-symbols:laptop-mac-outline',
    visible: true,
    disabled: true
  },
  {
    key: 'settings-notifications',
    label: 'Notifications',
    url: `/astrotribe/profile/settings/notifications`,
    icon: 'material-symbols:notifications',
    visible: true,
    disabled: true
  }
])
</script>

<template>
  <div>
    <NuxtLayout name="app">
      <div class="flex flex-col p-4 md:flex-row md:gap-8 lg:p-8">
        <PrimeMenu
          :model="settingsRoutes"
          :pt="{
            root: 'border-none !bg-transparent relative md:w-64',
            list: 'md:sticky md:top-8 flex md:flex-col justify-left !w-full items-center md:justify-end md:items-end overflow-scroll',
            item: 'w-full'
          }"
          :ptOptions="{ mergeSections: true, mergeProps: true }"

        >
          <template #item="{ item, disabled }">
            <NuxtLink
              v-if="item.url && !item.disabled"
              v-ripple
              :to="item.url"
              exact-active-class="bg-primary-950 text-white w-full"
              class="flex justify-between gap-2 rounded-md px-3 py-2 w-full"
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
