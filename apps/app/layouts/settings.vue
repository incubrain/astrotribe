<script setup lang="ts">
const { settingsRoutes } = useSettingsNavigation()
</script>

<template>
  <div class="flex flex-col h-screen">
    <NuxtLayout name="default">
      <div class="min-h-screen flex flex-col p-4 bg-black md:flex-row md:gap-8 lg:p-8">
        <SettingsNavigation :routes="settingsRoutes" />
        <div class="min-w-2xl max-w-6xl flex-grow">
          <slot />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
