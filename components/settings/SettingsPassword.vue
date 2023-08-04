<template>
  <UCard>
    <FormDynamic
      :schema="settingsPasswordData"
      :validation-schema="FormPasswordSchema"
      :placeholder="userPasswordSettings"
      @submit-form="onSubmitPassword"
    />
  </UCard>
</template>

<script setup lang="ts">
import { FormPasswordSchema } from '@/types/zod/settings'
import settingsPasswordData from '@/data/forms/settings-password.json'

const settings = useUserSettingsStore()
const { userPasswordSettings } = storeToRefs(settings)

function onSubmitPassword(value) {
  settings.updatePassword(value)
  console.log('Submitted form:', value)
}
</script>
