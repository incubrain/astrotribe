<script setup lang="ts">
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
    placeholder: 'Contact support to update your email',
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

const userSettingsStore = useUserSettingsStore()
const { settings } = storeToRefs(userSettingsStore)

const user = useCurrentUser()

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
      <div class="relative w-full max-w-[1200px] h-64">
        <BaseImage
          v-if="user.profile?.cover_image"
          :img="{
            src: user.profile.cover_image
          }"
          class="w-full h-full rounded-md overflow-hidden border border-color"
        />
        <BaseUploadCropper
          cropper-type="cover_image"
          class="absolute top-2 left-2"
        />

        <div
          class="w-32 h-32 absolute -bottom-16 left-16 bg-red-50 flex justify-center items-center rounded-full overflow-hidden"
        >
          <BaseImage
            v-if="user.profile?.avatar"
            :img="{
              src: user.profile.avatar
            }"
            class="w-full h-full"
          />
          <BaseUploadCropper
            cropper-type="avatar"
            class="absolute z-20"
          />
        </div>
      </div>

      <div class="pt-24">
        <UserSettingsItem
          v-for="item in schema"
          :key="item.value"
          :item="item"
        >
          <div class="w-full">
            <PrimeTextarea
              v-if="item.type === 'textarea'"
              v-model="settings[item.value]"
              rows="5"
              :pt="{
                root: 'w-full'
              }"
              :placeholder="item.placeholder"
            />
            <PrimeInputText
              v-else
              v-model="settings[item.value]"
              :type="item.type"
              :pt="{
                root: 'w-full'
              }"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
            />
          </div>
        </UserSettingsItem>
      </div>
    </UserSettingsCard>
  </div>
</template>
