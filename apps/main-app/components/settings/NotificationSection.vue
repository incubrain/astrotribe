<!-- components/settings/NotificationSection.vue -->
<script setup lang="ts">
const notifications = ref({
  email: true,
  push: false,
  newsletter: true,
})
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Notification Preferences',
      subtitle: 'Manage how you receive notifications',
    }"
  >
    <div class="space-y-6">
      <SettingsItem
        label="Email Notifications"
        tip="Receive important updates via email"
      >
        <PrimeToggleButton
          v-model="notifications.email"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
      </SettingsItem>

      <SettingsItem
        label="Push Notifications"
        tip="Receive notifications in your browser"
      >
        <PrimeToggleButton
          v-model="notifications.push"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
      </SettingsItem>

      <SettingsItem
        label="Newsletter"
        tip="Receive our astronomy newsletter"
      >
        <PrimeToggleButton
          v-model="notifications.newsletter"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
      </SettingsItem>

      <div class="pt-4">
        <PrimeButton>Save Preferences</PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
