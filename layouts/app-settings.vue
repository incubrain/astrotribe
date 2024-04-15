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
    label: 'Reset Password',
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
      <div class="flex flex-col md:flex-row gap-8">
        <PrimeMenu
          :model="settingsRoutes"
          :pt="{
            root: 'border-none bg-transparent relative',
            menu: 'sticky top-12 flex flex-col justify-end items-end',
            menuitem: 'rounded-full'
          }"
        >
          <template #item="{ item }">
            <div class="py-2">
              <NuxtLink
                v-if="item.url"
                v-ripple
                :to="item.url"
                exact-active-class="link-active"
                class="px-2"
              >
                <span class="mr-4">{{ item.label }}</span>
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                />
              </NuxtLink>
            </div>
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
