<template>
  <UCard>
    <template #header>
      <h1 class="text-2xl font-semibold pb-4">
        Welcome to your account {{ userAccountSettings.given_name }}</h1
      >
      <p> The ability to update password and email will be coming soon </p>
    </template>
    <FormDynamic
      :schema="schema"
      :validation-schema="FormAccountSchema"
      :placeholder="userAccountSettings"
      :has-labels="true"
      button-label="Update Account Info"
      @submit-form="onSubmitAccount"
    />
    <!-- <template #footer>
      <UButton> Contact Support </UButton>
    </template> -->
  </UCard>
</template>

<script setup lang="ts">
import { FormAccountSchema, SettingsAccount } from '@/types/settings'
import type { FormFieldType } from '@/types/forms'

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
        type: 'email',
        disabled: true
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
  ] as FormFieldType[]
})

const settings = useUserSettingsStore()
const auth = useAuth()
const { user } = auth
const { userAccountSettings } = storeToRefs(settings)

function onSubmitAccount(value: SettingsAccount) {
  if (!user.value) return
  settings.updateAccountSettings({ id: user.value.id, ...value })
}
</script>
