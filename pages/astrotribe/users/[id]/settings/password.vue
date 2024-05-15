<script setup lang="ts">
const schema = [
  {
    value: 'password',
    label: 'Current Password',
    tip: 'Your first name',
    placeholder: 'Your current password',
    type: 'password'
  },
  {
    value: 'new_password',
    label: 'New Password',
    tip: 'New password must be at least 8 characters long',
    placeholder: 'Your new password',
    type: 'password'
  },
  {
    value: 'confirm_new_password',
    label: 'Confirm Password',
    tip: 'Please confirm your new password',
    placeholder: 'Confirm Your password',
    type: 'password'
  }
]

const userSettingsStore = useUserSettingsStore()
const { settings } = storeToRefs(userSettingsStore)

definePageMeta({
  layoutTransition: false,
  name: 'SettingsPassword',
  layout: 'app-settings',
  middleware: 'is-current-user'
})
</script>

<template>
  <div>
    <UserSettingsCard
      :title="{
        main: 'Account Profile',
        subtitle: 'Update your account information'
      }"
    >
      <UserSettingsItem
        v-for="item in schema"
        :key="item.value"
        :item="item"
      >
        <FormPassword
          v-model="settings[item.value]"
          :pt="{
            root: 'w-full'
          }"
          :placeholder="item.placeholder"
        />
      </UserSettingsItem>
    </UserSettingsCard>
  </div>
</template>
