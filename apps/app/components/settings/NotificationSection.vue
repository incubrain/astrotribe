<!-- components/settings/NotificationsSection.vue -->
<script setup lang="ts">
interface NotificationPreferences {
  email: boolean
  push: boolean
  newsletter: boolean
}

const notifications = ref<NotificationPreferences>({
  email: true,
  push: false,
  newsletter: true,
})

const isSaving = ref(false)

async function saveNotificationPreferences() {
  try {
    isSaving.value = true
    // Add actual save functionality here
    toast.success({
      summary: 'Success',
      message: 'Your notification preferences have been saved',
    })
  } catch (error: any) {
    toast.error({
      summary: 'Error',
      message: 'Failed to save notification preferences',
    })
  } finally {
    isSaving.value = false
  }
}
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
        :item="{
          label: 'Email Notifications',
          tip: 'Receive important updates via email',
        }"
      >
        <div class="flex items-center gap-4">
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Icon
              name="lucide:mail"
              class="w-5 h-5 text-blue-500"
            />
          </div>
          <PrimeToggleButton
            v-model="notifications.email"
            class="w-16"
          />
        </div>
      </SettingsItem>

      <SettingsItem
        :item="{
          label: 'Push Notifications',
          tip: 'Receive notifications in your browser',
        }"
      >
        <div class="flex items-center gap-4">
          <div class="p-2 bg-purple-500/10 rounded-lg">
            <Icon
              name="lucide:bell"
              class="w-5 h-5 text-purple-500"
            />
          </div>
          <PrimeToggleButton
            v-model="notifications.push"
            class="w-16"
          />
        </div>
      </SettingsItem>

      <SettingsItem
        :item="{
          label: 'Newsletter',
          tip: 'Receive our astronomy newsletter',
        }"
      >
        <div class="flex items-center gap-4">
          <div class="p-2 bg-green-500/10 rounded-lg">
            <Icon
              name="lucide:newspaper"
              class="w-5 h-5 text-green-500"
            />
          </div>
          <PrimeToggleButton
            v-model="notifications.newsletter"
            class="w-16"
          />
        </div>
      </SettingsItem>

      <div class="flex justify-end pt-4">
        <PrimeButton
          :loading="isSaving"
          @click="saveNotificationPreferences"
        >
          Save Preferences
        </PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
