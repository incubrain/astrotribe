<!-- components/settings/SettingsNavigation.vue -->
<script setup lang="ts">
import { useSettingsNavigation } from '~/composables/useSettingsNavigation'

const { settingsRoutes } = useSettingsNavigation()
</script>

<template>
  <PrimeMenu
    :model="settingsRoutes"
    :pt="{
      root: 'border-none !bg-transparent relative md:w-64',
      list: 'md:sticky md:top-8 flex md:flex-col justify-left !w-full items-center md:justify-end md:items-end overflow-auto',
      item: 'w-full',
    }"
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
</template>
