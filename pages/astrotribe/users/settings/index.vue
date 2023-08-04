<template>
  <UTabs
    :items="items"
    class="w-full"
    orientation="vertical"
    :ui="{ wrapper: 'flex items-start gap-4', list: { width: 'w-48' } }"
  >
    <template #account>
      <LazySettingsAccount />
    </template>
    <template #password>
      <LazySettingsPassword />
    </template>
    <template #default="{ item, index, selected }">
      <div class="flex items-center w-full justify-between gap-2 relative truncate">
        <div class="flex gap-1 items-center">
          <span>
            {{ index + 1 }}.
          </span>
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
        </div>

        <span class="truncate">{{ item.label }}</span>

        <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
      </div>
    </template>
  </UTabs>
</template>

<script setup>
const items = [
  {
    slot: 'account',
    label: 'Account',
    icon: 'i-material-symbols-home'
  },
  {
    slot: 'password',
    label: 'Password',
    icon: 'i-material-symbols-key'
  },
  {
    slot: 'security',
    label: 'Security',
    icon: 'i-material-symbols-shield',
    disabled: true
  },
  {
    slot: 'application',
    label: 'Application',
    icon: 'i-material-symbols-apps',
    disabled: true
  },
  {
    slot: 'notifications',
    label: 'Notifications',
    icon: 'i-material-symbols-notifications',
    disabled: true
  }
]

const settings = useUserSettingsStore()

onMounted(() => {
  // Fetch user settings using the user's ID or another identifier
  const userId = 1
  settings.getUserSettings(userId)
})
</script>
