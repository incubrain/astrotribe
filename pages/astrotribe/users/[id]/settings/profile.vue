<script setup lang="ts">
// !todo replace tabs with PrimeMenu or PrimePanelMenu
import { z } from 'zod'

const schema = [
  {
    value: 'given_name',
    label: 'Given Name',
    tip: 'Your first name',
    placeholder: 'Your first name',
    type: 'text'
  },
  {
    value: 'surname',
    label: 'Surname',
    tip: 'Your last name',
    placeholder: 'Your last name',
    type: 'text'
  },
  {
    value: 'email',
    label: 'Email',
    tip: 'Your email address',
    placeholder: 'Contace support to update your email',
    type: 'email',
    disabled: true
  },
  {
    value: 'introduction',
    label: 'Introduction',
    tip: 'Share some information about yourself',
    placeholder: 'Tell us about yourself',
    type: 'textarea'
  },
  {
    value: 'quote',
    label: 'Quote',
    tip: 'Your favorite quote',
    placeholder: 'Your favorite quote',
    type: 'textarea'
  }
]

const SettingsAccountValidation = z.object({
  given_name: z.string().min(1, 'Given Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email(),
  introduction: z.string().min(240, 'At least 240 characters required').optional(),
  quote: z.string().min(10, 'At least 10 characters required').optional()
})

type SettingsAccountType = z.infer<typeof SettingsAccountValidation>

const { accountSettings } = useSettingsStore()

// if (user.value && String(id) !== user.value.id) {
//   push(`/astrotribe/users/${user.value.id}/settings`)
// }

definePageMeta({
  name: 'SettingsProfile',
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
        <div class="w-full">
          <PrimeTextarea
            v-if="item.type === 'textarea'"
            v-model="accountSettings[item.value]"
            rows="5"
            :pt="{
              root: 'w-full'
            }"
            :placeholder="item.placeholder"
          />
          <PrimeInputText
            v-else
            v-model="accountSettings[item.value]"
            :type="item.type"
            :pt="{
              root: 'w-full'
            }"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          />
        </div>
      </UserSettingsItem>
    </UserSettingsCard>
    <!-- <LazyUserSettingsAccount />
    <LazyUserSettingsPassword /> -->
  </div>
</template>
