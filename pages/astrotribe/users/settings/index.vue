<template>
  <UTabs
    :items="settings.tabs"
    orientation="vertical"
    :ui="{
      wrapper: 'flex flex-col lg:flex-row items-start gap-4 p-4 lg:p-0 max-w-[var(--max-width-md)]',
      list: { width: 'w-full lg:w-48' }
    }"
  >
    <template #account>
      <LazySettingsAccount />
    </template>
    <template #password>
      <LazySettingsPassword />
    </template>
    <template #default="{ item, index, selected }">
      <div class="flex items-center w-full justify-between gap-2 relative">
        <div class="flex gap-1 items-center">
          <span> {{ index + 1 }}. </span>
          <UIcon
            :name="item.icon"
            class="w-4 h-4 flex-shrink-0"
          />
        </div>

        <div class="relative flex gap-2 justify-center items-center">
          <span class="truncate">{{ item.label }}</span>
          <span
            v-if="selected"
            class="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
          />
        </div>
      </div>
    </template>
  </UTabs>
</template>

<script setup lang="ts">

const settings = useUserSettingsStore()

onMounted(() => {
  // Fetch user settings using the user's ID or another identifier
  const userId = 1
  settings.getUserSettings(userId)
})
</script>
