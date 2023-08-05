<template>
  <UCard>
    <FormDynamic
      :schema="settingsAccountData"
      :validation-schema="FormAccountSchema"
      :placeholder="userAccountSettings"
      :has-labels="true"
      @submit-form="onSubmitAccount"
    />
  </UCard>
</template>

<script setup lang="ts">
import { FormAccountSchema } from '@/types/zod/settings'
import settingsAccountData from '@/data/forms/settings-account.json'

// const schema = ref(settingsAccountData)

// console.log('settingsAccountData: ', schema.value)

const settings = useUserSettingsStore()
const { userAccountSettings } = storeToRefs(settings)

function onSubmitAccount(value: any) {
  console.log('Submitted form:', value)
  settings.updateAccountSettings(value)
}
</script>
