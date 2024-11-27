<script setup lang="ts">
const { settingsRoutes } = useSettingsNavigation()
</script>

<template>
  <div class="flex flex-col h-screen">
    <NuxtLayout name="app">
      <AppBackButton class="rounded-none !justify-start !items-start" />
      <div class="overflow-auto h-screen flex flex-col p-4 bg-black md:flex-row md:gap-8 lg:p-8">
        <SettingsNavigation :routes="settingsRoutes" />
        <div class="flex-grow">
          <slot />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
