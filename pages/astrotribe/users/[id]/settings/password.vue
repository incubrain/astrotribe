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

const currentUser = useCurrentUser()
await currentUser.fetchUserProfile()
const { profile } = storeToRefs(currentUser)

definePageMeta({
  layoutTransition: false,
  name: 'SettingsPassword',
  layout: 'app-settings',
  middleware: 'is-current-user'
})

const settings = reactive({
  password: '',
  new_password: '',
  confirm_new_password: ''
})

const isPasswordUpdatable = computed(() => profile.value?.providers.includes('email'))
</script>

<template>
  <div>
    <UserSettingsCard
      :title="{
        main: 'Update Password',
        subtitle: 'Change your password here'
      }"
    >
      <div v-if="isPasswordUpdatable">
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
      </div>
      <PrimeInlineMessage
        severity="info"
        v-else-if="profile"
      >
        You used {{ profile.provider }} to authenticate
      </PrimeInlineMessage>
    </UserSettingsCard>
  </div>
</template>
