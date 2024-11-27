<!-- components/settings/SecuritySection.vue -->
<script setup lang="ts">
import { usePasswordUpdate } from '~/composables/usePasswordUpdate'

const { updatePassword, isUpdating, schema } = usePasswordUpdate()
</script>

<template>
  <SettingsCard
    :title="{
      main: 'Security Settings',
      subtitle: 'Manage your password and security preferences',
    }"
  >
    <div class="space-y-6">
      <SettingsItem
        v-for="item in schema"
        :key="item.id"
        :item="item"
      >
        <FormPassword
          :id="item.id"
          v-model="item.value.value"
          :feedback="item.id !== 'confirm_new_password'"
          required
        />
      </SettingsItem>

      <div class="pt-4">
        <PrimeButton
          :loading="isUpdating"
          @click="updatePassword"
        >
          Update Password
        </PrimeButton>
      </div>
    </div>
  </SettingsCard>
</template>
