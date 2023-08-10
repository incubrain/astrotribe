<template>
  <UCard>
    <FormDynamic
      :schema="schema"
      :validation-schema="FormPasswordSchema"
      :placeholder="userPasswordSettings"
      :has-labels="true"
      @submit-form="onSubmitPassword"
    />
  </UCard>
</template>

<script setup lang="ts">
import { FormPasswordSchema, SettingsPassword } from 'types/settings'
import { FormField } from 'types/forms'

const schema = computed(() => {
  return [
    {
      name: 'currentPassword',
      width: 'full',
      props: {
        label: 'Current Password',
        type: 'password'
      }
    },
    {
      name: 'newPassword',
      width: 'full',
      props: {
        label: 'New Password',
        type: 'password'
      }
    },
    {
      name: 'confirmNewPassword',
      width: 'full',
      props: {
        label: 'Confirm Password',
        type: 'password'
      }
    }
  ] as FormField[]
})

const settings = useUserSettingsStore()
const { userPasswordSettings } = storeToRefs(settings)

function onSubmitPassword(value: SettingsPassword) {
  settings.updatePassword(value)
  console.log('Submitted form:', value)
}
</script>
