<template>
  <PrimeCard>
    <FormDynamic
      :schema="schema"
      :validation-schema="FormPasswordSchema"
      :placeholder="userPasswordSettings"
      :has-labels="true"
      @submit-form="onSubmitPassword"
    />
  </PrimeCard>
</template>

<script setup lang="ts">
import { FormPasswordSchema } from '@/types/settings'
import type { SettingsPasswordType } from '@/types/settings'
import type { FormFieldType } from '@/types/forms'

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
  ] as FormFieldType[]
})

const settings = useUserSettingsStore()
const { userPasswordSettings } = storeToRefs(settings)

function onSubmitPassword(value: SettingsPasswordType) {
  settings.updatePassword(value)
}
</script>
