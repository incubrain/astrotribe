<template>
  <UCard>
    <FormDynamic
      :schema="schema"
      :validation-schema="FormAccountSchema"
      :placeholder="userAccountSettings"
      :has-labels="true"
      @submit-form="onSubmitAccount"
    />
  </UCard>
</template>

<script setup lang="ts">
import { FormAccountSchema, SettingsAccount } from 'types/settings'
import { FormField } from 'types/forms'

const schema = computed(() => {
  return [
    {
      name: 'given_name',
      width: 'half',
      props: {
        label: 'Given Name',
        type: 'text'
      }
    },
    {
      name: 'surname',
      width: 'half',
      props: {
        label: 'Surname',
        type: 'text'
      }
    },
    {
      name: 'email',
      width: 'full',
      props: {
        label: 'Email',
        type: 'email'
      }
    },
    {
      name: 'introduction',
      width: 'full',
      props: {
        label: 'Introduction',
        type: 'textarea'
      }
    },
    {
      name: 'quote',
      width: 'full',
      props: {
        label: 'Quote',
        type: 'textarea'
      }
    }
  ] as FormField[]
})

const settings = useUserSettingsStore()
const { userAccountSettings } = storeToRefs(settings)

function onSubmitAccount(value: SettingsAccount) {
  console.log('Submitted form:', value)
  settings.updateAccountSettings(value)
}
</script>
